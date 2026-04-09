

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lower, when, array, array_remove, array_distinct


spark = SparkSession.builder \
    .appName("JobProcessing") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000") \
    .getOrCreate()

df = spark.read.option("multiLine", True).json(
    "file:///C:/Users/dtamb/Downloads/Job-Intelligence-System-main/Job-Intelligence-System-main/data/raw/jobs_20260405_174200.json"
)

print("RAW COUNT:", df.count())

SKILL_DB = [
    "python", "sql", "machine learning", "deep learning",
    "nlp", "tensorflow", "pytorch", "spark", "hadoop",
    "kafka", "aws", "azure", "gcp", "docker", "kubernetes",
    "pandas", "numpy", "tableau", "power bi",
    "react", "node", "java", "c++"
]


df = df.withColumn("description", lower(col("description")))

for skill in SKILL_DB:
    col_name = skill.replace(" ", "_")
    df = df.withColumn(
        col_name,
        when(col("description").contains(skill), skill)
    )

# combine into array
skill_cols = [skill.replace(" ", "_") for skill in SKILL_DB]

df = df.withColumn(
    "skills",
    array(*[col(c) for c in skill_cols])
)

# remove nulls
df = df.withColumn("skills", array_remove(col("skills"), None))

# remove duplicates
df = df.withColumn("skills", array_distinct(col("skills")))


jobs_clean = df.select(
    col("job_id"),
    lower(col("title")).alias("title"),
    col("company"),
    col("location"),
    col("country"),
    col("employment_type"),
    col("description"),
    col("apply_link"),
    col("posted_at"),
    col("is_remote"),
    col("skills")
)

jobs_clean = jobs_clean.fillna({
    "location": "unknown",
    "employment_type": "unknown"
})

print("PROCESSED COUNT:", jobs_clean.count())


jobs_clean.write.mode("overwrite").parquet(
    "hdfs://localhost:9000/jobs/processed/jobs_clean"
)

print("✅ Data saved to HDFS: jobs_clean")
