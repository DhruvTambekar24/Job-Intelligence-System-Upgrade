
from pyspark.sql.functions import col, lower, trim, to_timestamp, year, month
from spark_session import create_spark_session

spark = create_spark_session()

df = spark.read.option("multiLine", "true").json("hdfs://localhost:9000/jobs/raw/")

df.printSchema()
df.show(5, truncate=False)

print("Initial Count:", df.count())

df = df.dropna(subset=["title", "company", "description"])

df = df.withColumn("title", trim(lower(col("title"))))
df = df.withColumn("company", trim(lower(col("company"))))
df = df.withColumn("location", trim(lower(col("location"))))


df = df.withColumn("posted_at", to_timestamp(col("posted_at")))
df = df.withColumn("year", year(col("posted_at")))
df = df.withColumn("month", month(col("posted_at")))

#remove duplicates 
df = df.dropDuplicates(["job_id"])


df.write.mode("overwrite").parquet("hdfs://localhost:9000/jobs/processed/jobs_cleaned")

print("✅ Data written to HDFS")