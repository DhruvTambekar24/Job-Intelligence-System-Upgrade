from pyspark.sql.functions import col, count, desc
from spark_session import create_spark_session

spark = create_spark_session()


skills_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skills")

df1 = skills_df.alias("a")
df2 = skills_df.alias("b")

pairs = df1.join(
    df2,
    (col("a.job_id") == col("b.job_id")) &
    (col("a.skill") < col("b.skill"))   
)


cooccurrence = pairs.groupBy(
    col("a.skill").alias("skill_1"),
    col("b.skill").alias("skill_2")
).agg(
    count("*").alias("count")
).orderBy(desc("count"))

print("\n🔗 SKILL CO-OCCURRENCE")
cooccurrence.show(20, truncate=False)

cooccurrence.write.mode("overwrite") \
    .parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")

print("✅ Co-occurrence saved")