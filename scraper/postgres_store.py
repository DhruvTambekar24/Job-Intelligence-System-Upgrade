import json
import os
import sys
from pathlib import Path
from typing import Any

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import Json, execute_values

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = PROJECT_ROOT / "postgres" / "schema.sql"


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise ValueError(
            "DATABASE_URL not found. Please add it to your .env file."
        )

    return database_url


def get_connection():
    database_url = get_database_url()

    # Add sslmode=require only if not already present
    if "sslmode=" not in database_url:
        separator = "&" if "?" in database_url else "?"
        database_url += f"{separator}sslmode=require"

    return psycopg2.connect(
        database_url,
        connect_timeout=10,
        keepalives=1,
        keepalives_idle=30,
        keepalives_interval=10,
        keepalives_count=5,
    )


def init_db() -> None:
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(schema_sql)

    print("Schema initialized successfully.")


def upsert_jobs(jobs: list[dict[str, Any]]) -> int:
    jobs_by_id = {
        job["job_id"]: job
        for job in jobs
        if job.get("job_id")
    }

    valid_jobs = list(jobs_by_id.values())

    if not valid_jobs:
        return 0

    rows = [
        (
            job.get("job_id"),
            job.get("title"),
            job.get("company"),
            job.get("location"),
            job.get("country"),
            job.get("employment_type"),
            job.get("description"),
            job.get("apply_link"),
            job.get("posted_at"),
            job.get("salary_min"),
            job.get("salary_max"),
            job.get("is_remote"),
            job.get("skills_raw") or [],
            job.get("skills") or [],
            job.get("responsibilities") or [],
            job.get("scraped_role"),
            job.get("scraped_at"),
            Json(job),
        )
        for job in valid_jobs
    ]

    query = """
        INSERT INTO jobs (
            job_id,
            title,
            company,
            location,
            country,
            employment_type,
            description,
            apply_link,
            posted_at,
            salary_min,
            salary_max,
            is_remote,
            skills_raw,
            skills,
            responsibilities,
            scraped_role,
            scraped_at,
            raw_payload
        )
        VALUES %s
        ON CONFLICT (job_id) DO UPDATE SET
            title = EXCLUDED.title,
            company = EXCLUDED.company,
            location = EXCLUDED.location,
            country = EXCLUDED.country,
            employment_type = EXCLUDED.employment_type,
            description = EXCLUDED.description,
            apply_link = EXCLUDED.apply_link,
            posted_at = EXCLUDED.posted_at,
            salary_min = EXCLUDED.salary_min,
            salary_max = EXCLUDED.salary_max,
            is_remote = EXCLUDED.is_remote,
            skills_raw = EXCLUDED.skills_raw,
            skills = EXCLUDED.skills,
            responsibilities = EXCLUDED.responsibilities,
            scraped_role = EXCLUDED.scraped_role,
            scraped_at = EXCLUDED.scraped_at,
            raw_payload = EXCLUDED.raw_payload,
            updated_at = NOW()
    """

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, query, rows, page_size=500)

    return len(valid_jobs)


def main() -> None:
    init_db()

    if len(sys.argv) > 1:
        input_file = Path(sys.argv[1])

        with input_file.open("r", encoding="utf-8") as file:
            jobs = json.load(file)

        written = upsert_jobs(jobs)
        print(f"Upserted jobs: {written}")


if __name__ == "__main__":
    main()