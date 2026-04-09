from spark_session import create_spark_session

spark = create_spark_session()

df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/jobs_cleaned")

print("✅ Data Loaded Successfully")

print("\n📊 Schema:")
df.printSchema()

print("\n📄 Sample Data:")
df.show(10, truncate=False)

print("\n🔢 Total Rows:", df.count())