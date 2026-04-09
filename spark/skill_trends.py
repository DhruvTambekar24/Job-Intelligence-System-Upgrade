from pyspark.sql.functions import col, count, desc
from spark_session import create_spark_session

spark = create_spark_session()

# -------------------------------
# LOAD DATA
# -------------------------------
jobs_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_cleaned")
skills_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skills")

# -------------------------------
# JOIN JOBS + SKILLS
# -------------------------------
df = jobs_df.join(skills_df, on="job_id")

# remove null dates
df = df.filter(col("year").isNotNull())

# -------------------------------
# 📈 SKILL TRENDS
# -------------------------------
skill_trends = df.groupBy("year", "month", "skill") \
    .agg(count("*").alias("demand")) \
    .orderBy("year", "month", desc("demand"))

print("\n📈 SKILL TRENDS")
skill_trends.show(30, truncate=False)

# -------------------------------
# SAVE
# -------------------------------
skill_trends.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/skill_trends")

print("✅ Skill trends saved")