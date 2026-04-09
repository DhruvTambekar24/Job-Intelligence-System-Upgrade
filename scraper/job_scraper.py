

import requests
import json
import time
from datetime import datetime

API_KEY = "2548e745b5msheb10bbcc5f95cdep1752b7jsn1d1f000c7f2f"
URL = "https://jsearch.p.rapidapi.com/search"

HEADERS = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}


ROLES = [
    "data scientist",
    "software engineer",
    "machine learning engineer",
    "data analyst",
    "backend developer",
    "frontend developer",
    "full stack developer",
    "devops engineer",
    "cloud engineer",
    "cyber security engineer"
]

LOCATION = "india"
PAGES = 3   

all_jobs = []

def fetch_jobs(role, page):
    querystring = {
        "query": f"{role} jobs in {LOCATION}",
        "page": str(page),
        "num_pages": "1",
        "date_posted": "all"
    }

    try:
        response = requests.get(URL, headers=HEADERS, params=querystring)
        data = response.json()

        if "data" not in data:
            print(f"❌ Error for {role} page {page}: ", data)
            return []

        return data["data"]

    except Exception as e:
        print(f"⚠️ Exception: {e}")
        return []

for role in ROLES:
    print(f"\n🔍 Fetching jobs for: {role}")

    for page in range(1, PAGES + 1):
        jobs = fetch_jobs(role, page)

        for job in jobs:
            cleaned_job = {
                "job_id": job.get("job_id"),
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": job.get("job_city"),
                "country": job.get("job_country"),
                "employment_type": job.get("job_employment_type"),
                "description": job.get("job_description"),
                "apply_link": job.get("job_apply_link"),
                "posted_at": job.get("job_posted_at_datetime_utc"),
                "salary_min": job.get("job_min_salary"),
                "salary_max": job.get("job_max_salary"),
                "is_remote": job.get("job_is_remote"),

         
                "skills_raw": job.get("job_highlights", {}).get("Qualifications", []),
                "responsibilities": job.get("job_highlights", {}).get("Responsibilities", []),

                "scraped_role": role,
                "scraped_at": datetime.utcnow().isoformat()
            }

            all_jobs.append(cleaned_job)

        print(f"   Page {page} done ({len(jobs)} jobs)")
        time.sleep(1) 

output_file = f"../data/raw/jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

with open(output_file, "w") as f:
    json.dump(all_jobs, f, indent=4)

print(f"\n✅ Total jobs collected: {len(all_jobs)}")
print(f"📁 Saved to: {output_file}")