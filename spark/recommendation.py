from pyspark.sql.functions import col, desc, when
from spark_session import create_spark_session
import google.generativeai as genai
import os



# Fetch the key from environment variables
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-3-flash-preview")

spark = create_spark_session()


co_df = spark.read.parquet("hdfs://localhost:9000/jobs/processed/skill_cooccurrence")

user_skills = ["python"]


filtered = co_df.filter(
    (col("skill_1").isin(user_skills)) | 
    (col("skill_2").isin(user_skills))
)

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


top_recommendations = [row["recommended_skill"] for row in recommendations.limit(5).collect()]

print("\n🎯 Recommended Skills:", top_recommendations)



prompt = f"""
A user has the following skills: {user_skills}

Based on job market data, these are the recommended skills: {top_recommendations}

1. Explain why these skills are important
2. Suggest a learning path
3. Keep it concise and practical
"""

response = model.generate_content(prompt)

print("\n🤖 AI Career Guidance:\n")
print(response.text)

import json

output = {
    "user_skills": user_skills,
    "recommended_skills": top_recommendations,
    "ai_summary": response.text
}

with open("recommendation_output.json", "w") as f:
    json.dump(output, f, indent=4)

print("\n✅ AI Recommendation Generated")