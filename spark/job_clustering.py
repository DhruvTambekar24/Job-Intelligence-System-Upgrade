from pyspark.sql.functions import col
from pyspark.ml.feature import Tokenizer, StopWordsRemover, HashingTF, IDF
from pyspark.ml.clustering import KMeans
from pyspark.sql import SparkSession

# -------------------------------
# 🔹 SPARK SESSION
# -------------------------------
spark = SparkSession.builder \
    .appName("JobClustering") \
    .master("local[*]") \
    .getOrCreate()

print("✅ Spark Started")

# -------------------------------
# 🔹 LOAD DATA
# -------------------------------
df = spark.read.option("multiLine", True).json("data/raw/")

# If nested
if "data" in df.columns:
    df = df.selectExpr("explode(data) as job")
    df = df.select("job.*")

# Now safe
df = df.select("title", "description").dropna()
# Keep only required columns
df = df.select("title", "description").dropna()

print("Initial rows:", df.count())


tokenizer = Tokenizer(inputCol="description", outputCol="words")
df = tokenizer.transform(df)


remover = StopWordsRemover(inputCol="words", outputCol="filtered_words")
df = remover.transform(df)


hashingTF = HashingTF(inputCol="filtered_words", outputCol="rawFeatures", numFeatures=1000)
df = hashingTF.transform(df)


idf = IDF(inputCol="rawFeatures", outputCol="features")
idf_model = idf.fit(df)
df = idf_model.transform(df)



kmeans = KMeans(k=3, seed=42, featuresCol="features", predictionCol="cluster")

model = kmeans.fit(df)


df = model.transform(df)



print("\n🔥 CLUSTER RESULTS:")
df.select("title", "cluster").show(20, truncate=False)



print("\n📊 JOB COUNT PER CLUSTER:")
df.groupBy("cluster").count().show()


df.select("title", "description", "cluster") \
  .write.mode("overwrite") \
  .parquet("data/processed/job_clusters")

print("\n✅ Clustering completed and saved!")