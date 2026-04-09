# from fastapi import FastAPI
# from fastapi.responses import JSONResponse
# import logging
# import pandas as pd
# from fastapi.middleware.cors import CORSMiddleware
# from pyspark.sql import SparkSession
# import numpy as np

# from spark.spark_session import create_spark_session
# app = FastAPI()

# # -------------------------------
# # 🔥 ENABLE CORS (VERY IMPORTANT)
# # -------------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow frontend
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -------------------------------
# # 🔥 SPARK SESSION
# # -------------------------------
# spark = SparkSession.builder \
#     .appName("JobIntelAPI") \
#     .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000") \
#     .getOrCreate()

# logger = logging.getLogger("jobintel")
# logger.setLevel(logging.INFO)

# # -------------------------------
# # 📊 1. TOP SKILLS API
# # -------------------------------
# @app.get("/top-skills")
# def get_top_skills():
#     try:
#         df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/top_skills")
#         pdf = df.limit(10).toPandas()
#         pdf = pdf.where(pd.notnull(pdf), None)
#         return pdf.to_dict(orient="records")
#     except Exception as e:
#         logger.exception("Failed to load top_skills")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # -------------------------------
# # 🌍 2. JOBS BY CITY
# # -------------------------------
# @app.get("/jobs-by-city")
# def jobs_by_city():
#     try:
#         df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_by_city")
#         pdf = df.toPandas()
#         pdf = pdf.where(pd.notnull(pdf), None)
#         return pdf.to_dict(orient="records")
#     except Exception as e:
#         logger.exception("Failed to load jobs_by_city")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # -------------------------------
# # 📈 3. JOB TRENDS
# # -------------------------------
# @app.get("/job-trends")
# def job_trends():
#     try:
#         df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/job_trends")
#         pdf = df.toPandas()
#         pdf = pdf.replace({np.nan: None})
#         return pdf.to_dict(orient="records")
#     except Exception as e:
#         logger.exception("Failed to load job_trends")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # -------------------------------
# # 🔗 4. SKILL CO-OCCURRENCE
# # -------------------------------
# @app.get("/skill-cooccurrence")
# def skill_cooccurrence():
#     try:
#         df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")
#         pdf = df.limit(20).toPandas()
#         pdf = pdf.where(pd.notnull(pdf), None)
#         return pdf.to_dict(orient="records")
#     except Exception as e:
#         logger.exception("Failed to load skill_cooccurrence")
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # -------------------------------
# # 🤖 5. RECOMMENDATION API
# # -------------------------------
# from fastapi import Body
# from pyspark.sql.functions import col, desc, when
# import google.generativeai as genai
# import os

# # 🔥 Gemini setup (MOVE THIS TO TOP OF FILE)
# os.environ["GOOGLE_API_KEY"] = "AIzaSyDHHTohImrKDSD7KP1C9ZG8iteq0J-8w9g"
# genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
# model = genai.GenerativeModel("gemini-3-flash-preview")

# @app.post("/recommend")
# def recommend(user_skills: list[str] = Body(...)):
#     try:
#         print("USER SKILLS:", user_skills)
#         spark = create_spark_session()
#         co_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")

#         print("DATA LOADED")

#         filtered = co_df.filter(
#             (col("skill_1").isin(user_skills)) |
#             (col("skill_2").isin(user_skills))
#         )

#         print("FILTERED COUNT:", filtered.count())

#         recommendations = filtered.withColumn(
#             "recommended_skill",
#             when(col("skill_1").isin(user_skills), col("skill_2"))
#             .otherwise(col("skill_1"))
#         )

#         recommendations = recommendations.groupBy("recommended_skill") \
#             .agg({"count": "sum"}) \
#             .withColumnRenamed("sum(count)", "score") \
#             .orderBy(desc("score"))

#         recommendations = recommendations.filter(
#             ~col("recommended_skill").isin(user_skills)
#         )

#         top_skills = [
#             row["recommended_skill"]
#             for row in recommendations.limit(5).collect()
#         ]

#         print("TOP SKILLS:", top_skills)

#         # Gemini
#         prompt = f"""
#         A user has the following skills: {user_skills}
#         Recommended skills: {top_skills}
#         Explain why these are important and suggest a learning path.
#         """

#         response = model.generate_content(prompt)

#         return {
#             "recommended_skills": top_skills,
#             "ai_summary": response.text
#         }

#     except Exception as e:
#         print("ERROR:", str(e))
#         return {"error": str(e)}

# @app.get("/health")
# def health():
#     return {"status": "ok"}
from fastapi import FastAPI, Query, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, desc, when, explode
import pandas as pd
import numpy as np
import google.generativeai as genai
import os

app = FastAPI()

# -------------------------------
# 🔥 CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# 🔥 SPARK SESSION
# -------------------------------
spark = SparkSession.builder \
    .appName("JobIntelAPI") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000") \
    .getOrCreate()

# -------------------------------
# 🤖 GEMINI SETUP
# -------------------------------
os.environ["GOOGLE_API_KEY"] = "AIzaSyDHHTohImrKDSD7KP1C9ZG8iteq0J-8w9g"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-3-flash-preview")

# -------------------------------
# 📊 TOP SKILLS
# -------------------------------
@app.get("/top-skills")
def get_top_skills():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/top_skills")
        pdf = df.limit(10).toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}

# -------------------------------
# 🌍 JOBS BY CITY
# -------------------------------
@app.get("/jobs-by-city")
def jobs_by_city():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_by_city")
        pdf = df.toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}

# -------------------------------
# 📈 JOB TRENDS
# -------------------------------
@app.get("/job-trends")
def job_trends():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/job_trends")
        pdf = df.toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}

# -------------------------------
# 🔗 SKILL CO-OCCURRENCE
# -------------------------------
@app.get("/skill-cooccurrence")
def skill_cooccurrence():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")
        pdf = df.limit(20).toPandas().replace({np.nan: None})
        return pdf.to_dict("records")
    except Exception as e:
        return {"error": str(e)}

# =====================================================
# 🔥 NEW: JOB BOARD API (MOST IMPORTANT)
# =====================================================
@app.get("/jobs")
def get_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=50),
    skill: str = None,
    search: str = None
):
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_clean")

        # 🔍 filter by skill
        if skill:
            df = df.filter(
                col("skills").isNotNull() &
                col("skills").contains(skill.lower())
            )

        # 🔍 search
        if search:
            df = df.filter(
                col("title").contains(search.lower()) |
                col("description").contains(search.lower())
            )

        # 📅 latest first
        df = df.orderBy(col("posted_at").desc())

        # 📄 pagination
        offset = (page - 1) * limit
        pdf = df.limit(offset + limit).toPandas()
        pdf = pdf.iloc[offset:offset + limit]

        pdf = pdf.replace({np.nan: None})

        return {
            "page": page,
            "limit": limit,
            "count": len(pdf),
            "jobs": pdf.to_dict("records")
        }

    except Exception as e:
        return {"error": str(e)}

# -------------------------------
# 🔍 SINGLE JOB DETAILS
# -------------------------------
@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_clean")

        job = df.filter(col("job_id") == job_id).limit(1).toPandas()

        if job.empty:
            return {"error": "Job not found"}

        job = job.replace({np.nan: None})

        return job.to_dict("records")[0]

    except Exception as e:
        return {"error": str(e)}

# -------------------------------
# 🔎 SEARCH API
# -------------------------------
@app.get("/search/jobs")
def search_jobs(query: str):
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_clean")

        df = df.filter(
            col("title").contains(query.lower()) |
            col("description").contains(query.lower())
        )

        pdf = df.limit(20).toPandas().replace({np.nan: None})

        return pdf.to_dict("records")

    except Exception as e:
        return {"error": str(e)}


@app.get("/skills/all")
def get_all_skills():
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_clean")

        skills_df = df.select(explode("skills").alias("skill")).distinct()

        pdf = skills_df.toPandas()

        return pdf["skill"].dropna().tolist()

    except Exception as e:
        return {"error": str(e)}

# =====================================================
# 🤖 RECOMMENDATION API
# =====================================================
@app.post("/recommend")
def recommend(user_skills: list[str] = Body(...)):
    try:
        co_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")
        print("USER SKILLS:", user_skills)
        filtered = co_df.filter(
            (col("skill_1").isin(user_skills)) |
            (col("skill_2").isin(user_skills))
        )
        print("FILTERED COUNT:", filtered.count())
        recommendations = filtered.withColumn(
            "recommended_skill",
            when(col("skill_1").isin(user_skills), col("skill_2"))
            .otherwise(col("skill_1"))
        )

        recommendations = recommendations.groupBy("recommended_skill") \
            .agg({"count": "sum"}) \
            .withColumnRenamed("sum(count)", "score") \
            .orderBy(desc("score"))

        recommendations = recommendations.filter(
            ~col("recommended_skill").isin(user_skills)
        )

        top_skills = [
            row["recommended_skill"]
            for row in recommendations.limit(5).collect()
        ]
        print("TOP SKILLS:", top_skills)
        # 🤖 AI insight
        prompt = f"""
        User skills: {user_skills}
        Recommended: {top_skills}
        Explain importance + learning path.
        """

        response = model.generate_content(prompt)

        return {
            "recommended_skills": top_skills,
            "ai_summary": response.text
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/jobs/match")
def match_jobs(user_skills: list[str] = Body(...)):
    try:
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_clean")

        results = []

        for row in df.limit(100).collect():
            job_skills = row["skills"] or []

            if not job_skills:
                continue

            match_count = len(set(user_skills) & set(job_skills))
            score = int((match_count / len(job_skills)) * 100)

            job_dict = row.asDict()
            job_dict["match_score"] = score

            results.append(job_dict)

        # 🔥 sort by best match
        results = sorted(results, key=lambda x: x["match_score"], reverse=True)

        return results[:20]

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/job-clusters")
def get_job_clusters():
    try:
        # path = "file:///C:/Users/dtamb/OneDrive/Desktop/job-intelligence-system/data/processed/job_clusters"

        # df = spark.read.parquet(path)
        df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/job_clusters")
        # -------------------------------
        # 🔹 SAMPLE JOBS
        # -------------------------------
        jobs = df.select("title", "cluster").limit(100).toPandas()

        # -------------------------------
        # 🔹 CLUSTER DISTRIBUTION
        # -------------------------------
        cluster_counts = df.groupBy("cluster").count().toPandas()

        # -------------------------------
        # 🔹 RETURN RESPONSE
        # -------------------------------
        return {
            "jobs": jobs.to_dict("records"),
            "cluster_distribution": cluster_counts.to_dict("records")
        }

    except Exception as e:
        return {"error": str(e)}
    
# ❤️ HEALTH CHECK
# -------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}