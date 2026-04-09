# from pyspark.sql.functions import explode, col, lower, trim, when
# from spark_session import create_spark_session

# spark = create_spark_session()

# # -------------------------------
# # 🔹 LOAD CLEANED DATA FROM HDFS
# # -------------------------------
# df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_cleaned")

# print("Initial rows:", df.count())

# # -------------------------------
# # 🔥 STEP 1: EXPLODE RAW SKILLS
# # -------------------------------
# skills_df = df.select(
#     col("job_id"),
#     explode(col("skills_raw")).alias("raw_skill")
# )

# # -------------------------------
# # 🔥 STEP 2: CLEAN TEXT
# # -------------------------------
# skills_df = skills_df.withColumn(
#     "raw_skill",
#     lower(trim(col("raw_skill")))
# )

# # -------------------------------
# # 🔥 STEP 3: NORMALIZATION (NO UDF)
# # -------------------------------
# skills_df = skills_df.withColumn(
#     "skill",
#     when(col("raw_skill").contains("python"), "python")
#     .when(col("raw_skill").contains("sql"), "sql")
#     .when(col("raw_skill").contains("mysql"), "sql")
#     .when(col("raw_skill").contains("postgres"), "sql")
#     .when(col("raw_skill").contains("machine learning"), "ml")
#     .when(col("raw_skill").contains("deep learning"), "dl")
#     .when(col("raw_skill").contains("aws"), "aws")
#     .when(col("raw_skill").contains("amazon web services"), "aws")
#     .when(col("raw_skill").contains("javascript"), "javascript")
#     .when(col("raw_skill").contains("react"), "react")
#     .when(col("raw_skill").contains("node"), "nodejs")
#     .when(col("raw_skill").contains("spark"), "spark")
#     .when(col("raw_skill").contains("hadoop"), "hadoop")
#     .otherwise(col("raw_skill"))
# )

# # -------------------------------
# # 🔥 STEP 4: REMOVE NULLS
# # -------------------------------
# skills_df = skills_df.dropna(subset=["skill"])

# # -------------------------------
# # 🔥 STEP 5: REMOVE DUPLICATES
# # -------------------------------
# skills_df = skills_df.dropDuplicates(["job_id", "skill"])

# print("Extracted skills:", skills_df.count())

# # -------------------------------
# # 🔍 DEBUG OUTPUT
# # -------------------------------
# skills_df.show(20, truncate=False)

# # -------------------------------
# # 🔥 SAVE TO HDFS
# # -------------------------------
# skills_df.write.mode("overwrite") \
#     .parquet("hdfs://localhost:9000/jobs/processed/skills")

# print("✅ Skill Extraction Completed")



from pyspark.sql.functions import col, lower, when
from spark_session import create_spark_session

spark = create_spark_session()

df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_cleaned")

print("Jobs:", df.count())


df = df.withColumn("description", lower(col("description")))

skills_df = df.select("job_id", "description")


skills_df = skills_df.withColumn(
    "python", col("description").contains("python")
).withColumn(
    "sql", col("description").contains("sql")
).withColumn(
    "aws", col("description").contains("aws")
).withColumn(
    "ml", col("description").contains("machine learning")
).withColumn(
    "spark", col("description").contains("spark")
).withColumn(
    "hadoop", col("description").contains("hadoop")
)


from pyspark.sql.functions import expr

skills_long = skills_df.selectExpr(
    "job_id",
    "stack(6, \
    'python', python, \
    'sql', sql, \
    'aws', aws, \
    'ml', ml, \
    'spark', spark, \
    'hadoop', hadoop) as (skill, present)"
)


skills_long = skills_long.filter(col("present") == True)

print("Extracted skills:", skills_long.count())

skills_long.show(20, truncate=False)


skills_long.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/skills")

print("✅ Skills extracted from description")