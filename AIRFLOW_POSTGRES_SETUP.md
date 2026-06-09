# Airflow + Postgres Setup

This project now supports this flow:

1. Airflow schedules the scraper.
2. The scraper writes a timestamped JSON file to `data/raw`.
3. The same scraped jobs are upserted into Postgres.
4. FastAPI reads job board routes from Postgres.

## Environment

Copy `.env.example` to `.env` and fill in at least:

```env
JSEARCH_API_KEY=your_rapidapi_jsearch_key
DATABASE_URL=postgresql://jobintel:jobintel@localhost:5432/jobintel
STORE_TO_POSTGRES=true
```

`GOOGLE_API_KEY` is only needed for the AI summary in `/recommend`.

## Start Postgres

```powershell
docker compose -f docker-compose.postgres.yml up -d
```

The schema is in `postgres/schema.sql`. The default connection string is:

```text
postgresql://jobintel:jobintel@localhost:5432/jobintel
```

## Test Scraping Without Airflow

```powershell
pip install -r requirements.txt
$env:STORE_TO_POSTGRES="true"
python scraper/job_scraper.py
```

## Airflow DAG

The DAG is at:

```text
airflow/dags/job_scraping_dag.py
```

Install Airflow in your Airflow environment:

```powershell
pip install -r requirements-airflow.txt
```

Then point Airflow to this DAG folder or copy the DAG into your configured Airflow `dags_folder`.

Useful Airflow environment variables:

```env
AIRFLOW_PROJECT_ROOT=C:\Users\manty\Desktop\Job-Intelligence-System-Upgrade
JSEARCH_API_KEY=your_rapidapi_jsearch_key
DATABASE_URL=postgresql://jobintel:jobintel@localhost:5432/jobintel
SCRAPER_LOCATION=india
SCRAPER_PAGES=3
```

The DAG id is:

```text
job_scraping_to_postgres
```

It runs daily and can also be triggered manually from the Airflow UI.
