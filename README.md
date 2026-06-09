# Job Intelligence System Upgrade

This project scrapes job listings, stores them in Postgres, and exposes them through a FastAPI backend. Airflow is used to automate the scraping pipeline.

## Current Architecture

```text
Airflow
  -> scraper/job_scraper.py
  -> data/raw/jobs_*.json
  -> scraper/postgres_store.py
  -> Postgres jobs table
  -> FastAPI backend /jobs APIs
```

`data/raw` is kept as a staging and backup copy of each scrape. Postgres is the main database for job browsing/search APIs.

## Requirements

- Python
- Docker Desktop, for local Postgres
- Apache Airflow, already installed on your system
- RapidAPI JSearch API key

Install Python dependencies:

```powershell
pip install -r requirements.txt
```

## Environment

Create a `.env` file in the project root:

```env
JSEARCH_API_KEY=your_rapidapi_jsearch_key
DATABASE_URL=postgresql://jobintel:jobintel@localhost:5432/jobintel
STORE_TO_POSTGRES=true

SCRAPER_LOCATION=india
SCRAPER_PAGES=1
SCRAPER_SLEEP_SECONDS=5
SCRAPER_ROLES=data scientist,software engineer,machine learning engineer,data analyst,backend developer,frontend developer,full stack developer,devops engineer,cloud engineer,cyber security engineer

GOOGLE_API_KEY=
AIRFLOW_PROJECT_ROOT=C:\Users\manty\Desktop\Job-Intelligence-System-Upgrade
```

## Start Postgres

```powershell
docker compose -f docker-compose.postgres.yml up -d
```

Check it is running:

```powershell
docker ps
```

You should see the `jobintel-postgres` container.

## Initialize Database

Run once, or whenever the schema changes:

```powershell
python scraper/postgres_store.py
```

Expected output:

```text
Postgres schema initialized.
```

## Run Scraper Manually

Manual run is useful for testing before using Airflow:

```powershell
python scraper/job_scraper.py
```

Expected output:

```text
Total jobs collected: 100
Saved to: data/raw/jobs_...
Upserted to Postgres: ...
```

If RapidAPI returns `403`, check the API key and JSearch subscription. If it returns `429`, reduce roles/pages or wait for quota reset.

## Load Existing Raw JSON Into Postgres

Use this when you already have a file in `data/raw` and do not want to call RapidAPI again:

```powershell
python scraper/postgres_store.py data/raw/jobs_20260609_224057.json
```

## Check Data In Postgres

Open `psql` inside the Postgres container:

```powershell
docker exec -it jobintel-postgres psql -U jobintel -d jobintel
```

Then run:

```sql
SELECT COUNT(*) FROM jobs;
SELECT job_id, title, company, location, scraped_at FROM jobs LIMIT 10;
```

Exit:

```sql
\q
```

## Run Airflow

The DAG file is:

```text
airflow/dags/job_scraping_dag.py
```

DAG id:

```text
job_scraping_to_postgres
```

Make sure Airflow can see the DAG. Check your Airflow DAG folder:

```powershell
airflow config get-value core dags_folder
```

Copy the DAG there if needed:

```powershell
Copy-Item airflow\dags\job_scraping_dag.py "$env:USERPROFILE\airflow\dags"
```

Set environment variables before starting Airflow:

```powershell
$env:AIRFLOW_PROJECT_ROOT="C:\Users\manty\Desktop\Job-Intelligence-System-Upgrade"
$env:JSEARCH_API_KEY="your_rapidapi_jsearch_key"
$env:DATABASE_URL="postgresql://jobintel:jobintel@localhost:5432/jobintel"
```

Start Airflow in two terminals:

```powershell
airflow webserver --port 8080
```

```powershell
airflow scheduler
```

Open:

```text
http://localhost:8080
```

Unpause and trigger:

```text
job_scraping_to_postgres
```

Task order:

```text
init_postgres -> scrape_jobs -> store_jobs_postgres
```

`init_postgres` is safe to run every time, but it is only strictly needed during first setup or after schema changes.

## Run Backend

```powershell
uvicorn backend.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/jobs
```

The job board routes read from Postgres:

```text
/jobs
/jobs/{job_id}
/search/jobs
/skills/all
/jobs/match
```

Some analytics routes still read Spark/HDFS outputs:

```text
/top-skills
/jobs-by-city
/job-trends
/skill-cooccurrence
/job-clusters
```

## Notes

- Cassandra is not used in the current Airflow + Postgres flow.
- `data/raw` is optional for the final architecture, but useful for debugging and reloading data without using API quota.
- Keep API keys in `.env`, not in source code.
