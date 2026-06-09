import os
from datetime import datetime

import numpy as np
from fastapi import Body, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, desc, when

from scraper.postgres_store import get_connection

try:
    import google.generativeai as genai
except ImportError:
    genai = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

spark = (
    SparkSession.builder.appName("JobIntelAPI")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

gemini_api_key = os.getenv("GOOGLE_API_KEY")
model = None
if genai and gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-3-flash-preview"))


def serialize_job(row):
    job = dict(row)
    for key, value in job.items():
        if isinstance(value, datetime):
            job[key] = value.isoformat()
    return job


@app.get("/top-skills")
def get_top_skills():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/top_skills")
        pdf = df.limit(10).toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}


@app.get("/jobs-by-city")
def jobs_by_city():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_by_city")
        pdf = df.toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}


@app.get("/job-trends")
def job_trends():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/job_trends")
        pdf = df.toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}


@app.get("/skill-cooccurrence")
def skill_cooccurrence():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")
        pdf = df.limit(20).toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}


@app.get("/jobs")
def get_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=50),
    skill: str | None = None,
    search: str | None = None,
):
    try:
        conditions = []
        params = []

        if skill:
            conditions.append("lower(%s) = ANY(skills)")
            params.append(skill.lower())

        if search:
            conditions.append(
                """to_tsvector(
                    'english',
                    coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(description, '')
                ) @@ plainto_tsquery('english', %s)"""
            )
            params.append(search)

        where_sql = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        offset = (page - 1) * limit

        query = f"""
            SELECT
                job_id,
                title,
                company,
                location,
                country,
                employment_type,
                description,
                apply_link,
                posted_at,
                salary_min,
                salary_max,
                is_remote,
                skills,
                scraped_role,
                scraped_at
            FROM jobs
            {where_sql}
            ORDER BY posted_at DESC NULLS LAST, scraped_at DESC
            LIMIT %s OFFSET %s
        """

        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, [*params, limit, offset])
                jobs = [serialize_job(row) for row in cur.fetchall()]

        return {"page": page, "limit": limit, "count": len(jobs), "jobs": jobs}
    except Exception as e:
        return {"error": str(e)}


@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    try:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM jobs WHERE job_id = %s LIMIT 1", [job_id])
                job = cur.fetchone()

        if not job:
            return {"error": "Job not found"}

        return serialize_job(job)
    except Exception as e:
        return {"error": str(e)}


@app.get("/search/jobs")
def search_jobs(query: str):
    try:
        sql = """
            SELECT
                job_id,
                title,
                company,
                location,
                country,
                employment_type,
                description,
                apply_link,
                posted_at,
                is_remote,
                skills
            FROM jobs
            WHERE to_tsvector(
                'english',
                coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(description, '')
            ) @@ plainto_tsquery('english', %s)
            ORDER BY posted_at DESC NULLS LAST, scraped_at DESC
            LIMIT 20
        """
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, [query])
                return [serialize_job(row) for row in cur.fetchall()]
    except Exception as e:
        return {"error": str(e)}


@app.get("/skills/all")
def get_all_skills():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT DISTINCT skill
                    FROM jobs, unnest(skills) AS skill
                    WHERE skill IS NOT NULL AND skill <> ''
                    ORDER BY skill
                    """
                )
                return [row[0] for row in cur.fetchall()]
    except Exception as e:
        return {"error": str(e)}


@app.post("/recommend")
def recommend(user_skills: list[str] = Body(...)):
    try:
        co_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")
        filtered = co_df.filter(
            (col("skill_1").isin(user_skills)) | (col("skill_2").isin(user_skills))
        )
        recommendations = filtered.withColumn(
            "recommended_skill",
            when(col("skill_1").isin(user_skills), col("skill_2")).otherwise(col("skill_1")),
        )

        recommendations = (
            recommendations.groupBy("recommended_skill")
            .agg({"count": "sum"})
            .withColumnRenamed("sum(count)", "score")
            .orderBy(desc("score"))
            .filter(~col("recommended_skill").isin(user_skills))
        )

        top_skills = [row["recommended_skill"] for row in recommendations.limit(5).collect()]

        if not model:
            return {
                "recommended_skills": top_skills,
                "ai_summary": "Set GOOGLE_API_KEY to enable the generated learning-path summary.",
            }

        prompt = f"""
        User skills: {user_skills}
        Recommended: {top_skills}
        Explain importance + learning path.
        """
        response = model.generate_content(prompt)

        return {"recommended_skills": top_skills, "ai_summary": response.text}
    except Exception as e:
        return {"error": str(e)}


@app.post("/jobs/match")
def match_jobs(user_skills: list[str] = Body(...)):
    try:
        normalized_skills = [skill.lower() for skill in user_skills]
        sql = """
            SELECT
                job_id,
                title,
                company,
                location,
                country,
                employment_type,
                description,
                apply_link,
                posted_at,
                is_remote,
                skills,
                cardinality(ARRAY(
                    SELECT skill FROM unnest(skills) AS skill
                    WHERE lower(skill) = ANY(%s)
                )) AS match_count,
                cardinality(skills) AS skill_count
            FROM jobs
            WHERE skills && %s
            ORDER BY match_count DESC, posted_at DESC NULLS LAST
            LIMIT 20
        """

        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(sql, [normalized_skills, normalized_skills])
                rows = cur.fetchall()

        results = []
        for row in rows:
            job = serialize_job(row)
            skill_count = job.pop("skill_count") or 1
            match_count = job.pop("match_count") or 0
            job["match_score"] = int((match_count / skill_count) * 100)
            results.append(job)

        return results
    except Exception as e:
        return {"error": str(e)}


@app.get("/job-clusters")
def get_job_clusters():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/job_clusters")
        jobs = df.select("title", "cluster").limit(100).toPandas()
        cluster_counts = df.groupBy("cluster").count().toPandas()

        return {
            "jobs": jobs.to_dict("records"),
            "cluster_distribution": cluster_counts.to_dict("records"),
        }
    except Exception as e:
        return {"error": str(e)}


@app.get("/health")
def health():
    return {"status": "ok"}
