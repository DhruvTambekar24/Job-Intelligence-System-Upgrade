# from pyspark.sql.functions import count, desc, avg
# from spark_session import create_spark_session

# spark = create_spark_session()

# jobs_df = spark.read.parquet("../data/processed/jobs_cleaned")
# skills_df = spark.read.parquet("../data/processed/skills")

# # -------------------------------
# # 📊 1. TOP SKILLS
# # -------------------------------
# top_skills = skills_df.groupBy("skill") \
#     .agg(count("*").alias("demand")) \
#     .orderBy(desc("demand"))

# top_skills.show(20)

# # -------------------------------
# # 📊 2. JOB COUNT BY LOCATION
# # -------------------------------
# jobs_by_location = jobs_df.groupBy("location") \
#     .count() \
#     .orderBy(desc("count"))

# jobs_by_location.show()

# # -------------------------------
# # 📊 3. JOB TREND (MONTHLY)
# # -------------------------------
# job_trends = jobs_df.groupBy("year", "month") \
#     .count() \
#     .orderBy("year", "month")

# job_trends.show()

# # -------------------------------
# # 📊 4. AVG SALARY BY ROLE
# # -------------------------------
# salary_analysis = jobs_df.groupBy("title") \
#     .agg(avg("salary_max").alias("avg_salary")) \
#     .orderBy(desc("avg_salary"))

# salary_analysis.show()

# # -------------------------------
# # 📊 SAVE ALL RESULTS
# # -------------------------------
# top_skills.write.mode("overwrite").parquet("../data/processed/top_skills")
# jobs_by_location.write.mode("overwrite").parquet("../data/processed/location_stats")
# job_trends.write.mode("overwrite").parquet("../data/processed/trends")
# salary_analysis.write.mode("overwrite").parquet("../data/processed/salary")

# print("✅ Aggregations Done")

from pyspark.sql.functions import count, desc, col, year, month, avg
from spark_session import create_spark_session

spark = create_spark_session()

jobs_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_cleaned")
skills_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skills")

print("Jobs:", jobs_df.count())
print("Skills:", skills_df.count())


top_skills = skills_df.groupBy("skill") \
    .agg(count("*").alias("demand")) \
    .orderBy(desc("demand"))

print("\n🔥 TOP SKILLS")
top_skills.show(20, truncate=False)


top_skills.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/top_skills")


jobs_by_city = jobs_df.groupBy("location") \
    .agg(count("*").alias("job_count")) \
    .orderBy(desc("job_count"))

print("\n🌍 JOBS BY CITY")
jobs_by_city.show(20, truncate=False)

# Save
jobs_by_city.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/jobs_by_city")

job_trends = jobs_df.groupBy("year", "month") \
    .agg(count("*").alias("jobs_posted")) \
    .orderBy("year", "month")

print("\n📈 JOB TRENDS")
job_trends.show(20, truncate=False)

# Save
job_trends.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/job_trends")



salary_df = jobs_df.filter(col("salary_max").isNotNull())

salary_analysis = salary_df.groupBy("title") \
    .agg(avg("salary_max").alias("avg_salary")) \
    .orderBy(desc("avg_salary"))

print("\n💰 SALARY ANALYSIS")
salary_analysis.show(20, truncate=False)


salary_analysis.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/salary_analysis")


print("\n✅ ALL AGGREGATIONS COMPLETED")