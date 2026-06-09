import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass


URL = "https://jsearch.p.rapidapi.com/search"
API_HOST = "jsearch.p.rapidapi.com"

DEFAULT_ROLES = [
    "data scientist",
    "software engineer",
    "machine learning engineer",
    "data analyst",
    "backend developer",
    "frontend developer",
    "full stack developer",
    "devops engineer",
    "cloud engineer",
    "cyber security engineer",
]

SKILL_DB = [
    "python",
    "sql",
    "machine learning",
    "deep learning",
    "nlp",
    "tensorflow",
    "pytorch",
    "spark",
    "hadoop",
    "kafka",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "pandas",
    "numpy",
    "tableau",
    "power bi",
    "react",
    "node",
    "java",
    "c++",
]

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "data" / "raw"


def _split_roles(raw_roles: str | None) -> list[str]:
    if not raw_roles:
        return DEFAULT_ROLES
    return [role.strip() for role in raw_roles.split(",") if role.strip()]


def get_api_key() -> str:
    api_key = os.getenv("JSEARCH_API_KEY") or os.getenv("RAPIDAPI_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing RapidAPI key. Set JSEARCH_API_KEY or RAPIDAPI_KEY in your environment."
        )
    return api_key


def fetch_jobs(
    role: str,
    page: int,
    *,
    api_key: str | None = None,
    location: str = "india",
    timeout: int = 30,
) -> list[dict[str, Any]]:
    headers = {
        "X-RapidAPI-Key": api_key or get_api_key(),
        "X-RapidAPI-Host": API_HOST,
    }
    querystring = {
        "query": f"{role} jobs in {location}",
        "page": str(page),
        "num_pages": "1",
        "date_posted": "all",
    }

    response = requests.get(URL, headers=headers, params=querystring, timeout=timeout)
    response.raise_for_status()
    data = response.json()

    if "data" not in data:
        raise RuntimeError(f"Unexpected JSearch response for {role} page {page}: {data}")

    return data["data"]


def clean_job(job: dict[str, Any], scraped_role: str) -> dict[str, Any]:
    highlights = job.get("job_highlights") or {}
    description = job.get("job_description") or ""
    description_lower = description.lower()
    skills = [skill for skill in SKILL_DB if skill in description_lower]

    return {
        "job_id": job.get("job_id"),
        "title": job.get("job_title"),
        "company": job.get("employer_name"),
        "location": job.get("job_city"),
        "country": job.get("job_country"),
        "employment_type": job.get("job_employment_type"),
        "description": description,
        "apply_link": job.get("job_apply_link"),
        "posted_at": job.get("job_posted_at_datetime_utc"),
        "salary_min": job.get("job_min_salary"),
        "salary_max": job.get("job_max_salary"),
        "is_remote": job.get("job_is_remote"),
        "skills_raw": highlights.get("Qualifications", []),
        "skills": skills,
        "responsibilities": highlights.get("Responsibilities", []),
        "scraped_role": scraped_role,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def scrape_jobs(
    *,
    roles: list[str] | None = None,
    location: str | None = None,
    pages: int | None = None,
    sleep_seconds: float | None = None,
    api_key: str | None = None,
) -> list[dict[str, Any]]:
    roles = roles or _split_roles(os.getenv("SCRAPER_ROLES"))
    location = location or os.getenv("SCRAPER_LOCATION", "india")
    pages = pages or int(os.getenv("SCRAPER_PAGES", "3"))
    sleep_seconds = (
        sleep_seconds
        if sleep_seconds is not None
        else float(os.getenv("SCRAPER_SLEEP_SECONDS", "1"))
    )
    api_key = api_key or get_api_key()

    all_jobs: list[dict[str, Any]] = []

    for role in roles:
        print(f"Fetching jobs for: {role}")

        for page in range(1, pages + 1):
            try:
                jobs = fetch_jobs(role, page, api_key=api_key, location=location)
            except Exception as exc:
                print(f"Error for {role} page {page}: {exc}")
                continue

            all_jobs.extend(clean_job(job, role) for job in jobs)
            print(f"  Page {page} done ({len(jobs)} jobs)")
            time.sleep(sleep_seconds)

    return all_jobs


def save_jobs_json(
    jobs: list[dict[str, Any]],
    output_dir: str | Path = DEFAULT_OUTPUT_DIR,
) -> Path:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    file_path = output_path / f"jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with file_path.open("w", encoding="utf-8") as file:
        json.dump(jobs, file, indent=4)

    return file_path


def main() -> Path:
    jobs = scrape_jobs()
    output_file = save_jobs_json(jobs)
    print(f"Total jobs collected: {len(jobs)}")
    print(f"Saved to: {output_file}")

    if not jobs:
        print("No jobs collected; skipping Postgres upsert.")
        return output_file

    if os.getenv("STORE_TO_POSTGRES", "false").lower() == "true":
        try:
            from scraper.postgres_store import init_db, upsert_jobs
        except ModuleNotFoundError:
            from postgres_store import init_db, upsert_jobs

        init_db()
        written = upsert_jobs(jobs)
        print(f"Upserted to Postgres: {written}")

    return output_file


if __name__ == "__main__":
    main()
