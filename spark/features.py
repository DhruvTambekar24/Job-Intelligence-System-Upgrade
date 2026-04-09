from pyspark.sql.functions import size, col
from spark_session import create_spark_session

spark = create_spark_session()

df = spark.read.parquet("../data/processed/jobs_cleaned")


df = df.withColumn("skill_count", size(col("skills_raw")))


df = df.withColumn(
    "is_high_paying",
    (col("salary_max") > 100000).cast("boolean")
)

df.show()

df.write.mode("overwrite").parquet("../data/processed/jobs_features")

print("✅ Feature Engineering Done")