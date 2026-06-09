import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

from airflow import DAG
from airflow.operators.python import PythonOperator


PROJECT_ROOT = Path(os.getenv("AIRFLOW_PROJECT_ROOT", Path(__file__).resolve().parents[2]))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


def initialize_postgres() -> None:
    from scraper.postgres_store import init_db

    init_db()


def scrape_to_json() -> str:
    from scraper.job_scraper import save_jobs_json, scrape_jobs

    jobs = scrape_jobs()
    output_file = save_jobs_json(jobs)
    return str(output_file)


def load_json_to_postgres(**context) -> int:
    from scraper.postgres_store import upsert_jobs

    output_file = context["ti"].xcom_pull(task_ids="scrape_jobs")
    with open(output_file, "r", encoding="utf-8") as file:
        jobs = json.load(file)

    return upsert_jobs(jobs)


default_args = {
    "owner": "job-intelligence",
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}


with DAG(
    dag_id="job_scraping_to_postgres",
    description="Scrape JSearch jobs and upsert them into Postgres.",
    default_args=default_args,
    start_date=datetime(2026, 1, 1),
    schedule="@daily",
    catchup=False,
    max_active_runs=1,
    tags=["jobs", "scraping", "postgres"],
) as dag:
    init_postgres = PythonOperator(
        task_id="init_postgres",
        python_callable=initialize_postgres,
    )

    scrape_jobs_task = PythonOperator(
        task_id="scrape_jobs",
        python_callable=scrape_to_json,
    )

    store_jobs_task = PythonOperator(
        task_id="store_jobs_postgres",
        python_callable=load_json_to_postgres,
    )

    init_postgres >> scrape_jobs_task >> store_jobs_task
