# Job Intelligence System Upgrade

Job Intelligence System Upgrade is a data engineering project that collects live job listings, stores the raw scrape as JSON, loads the curated data into Postgres, and serves it through a FastAPI backend and Next.js frontend. Airflow orchestrates the scraping pipeline, Spark is used for the analytics/recommendation layer, and Docker is used to run Airflow locally in a repeatable way.

## What The Project Does

```text
RapidAPI JSearch
  -> scraper/job_scraper.py
  -> data/raw/jobs_*.json
  -> scraper/postgres_store.py
  -> Postgres jobs table
  -> FastAPI backend
  -> Next.js frontend
```

The pipeline keeps `data/raw` as a timestamped landing zone for each scrape. Postgres is the source of truth for the job board and search API. The frontend reads from the backend API and displays jobs, recommendations, trends, and other analytics views.

## Tech Stack

- Airflow for scheduling and orchestration
- Docker for local Airflow/Postgres setup
- Postgres for job storage and querying
- Supabase Postgres as the intended hosted database target
- Spark for analytics and skill recommendation processing
- FastAPI for the backend API
- Next.js for the frontend UI
- RapidAPI JSearch for the job data source

## Current Status

- The job scraping to Postgres flow is implemented and usable.
- The backend still contains legacy Spark/HDFS references in some analytics endpoints.
- HDFS and Cassandra are not part of the intended runtime for this project.
- Those HDFS-linked analytics calls are meant to be migrated to Supabase/Postgres-backed data.

## Requirements

- Python 3.10+
- Node.js 18+
- Docker Desktop
- RapidAPI JSearch API key
- Supabase Postgres connection string or another Postgres database URL

Install the Python dependencies:

```powershell
pip install -r requirements.txt
```

Install the frontend dependencies:

```powershell
cd frontend
pnpm install
```

## Environment

Create a `.env` file in the project root:

```env
JSEARCH_API_KEY=your_rapidapi_jsearch_key
DATABASE_URL=postgresql://username:password@host:5432/database_name
STORE_TO_POSTGRES=true

SCRAPER_LOCATION=india
SCRAPER_PAGES=1
SCRAPER_SLEEP_SECONDS=5
SCRAPER_ROLES=data scientist,software engineer,machine learning engineer,data analyst,backend developer,frontend developer,full stack developer,devops engineer,cloud engineer,cyber security engineer

GOOGLE_API_KEY=
AIRFLOW_PROJECT_ROOT=C:\Users\manty\Desktop\Job-Intelligence-System-Upgrade
```

For the frontend, create `frontend/.env.local` if you want to override the API URL:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Docker Airflow Setup

The local Airflow stack is defined in `docker-compose.airflow.yml` and includes Airflow plus a small Postgres container for Airflow metadata.

The custom Airflow image is published on Docker Hub at [devik009/jobintel-airflow](https://hub.docker.com/repository/docker/devik009/jobintel-airflow/).

Initialize Airflow once:

```powershell
docker compose -f docker-compose.airflow.yml up airflow-init
```

### Initial setup

```powershell
docker compose -f docker-compose.airflow.yml up airflow-init
```

Start the webserver and scheduler:

```powershell
docker compose -f docker-compose.airflow.yml up -d airflow-webserver airflow-scheduler
```

### Start Airflow

```powershell
docker compose -f docker-compose.airflow.yml up -d airflow-webserver airflow-scheduler
```

Open the Airflow UI at:

```text
http://localhost:8080
```

Default Airflow login:

```text
username: admin
password: admin
```

The DAG is located at:

```text
airflow/dags/job_scraping_dag.py
```

Its DAG id is:

```text
job_scraping_to_postgres
```

Pipeline order:

```text
init_postgres -> scrape_jobs -> store_jobs_postgres
```

## Scraper

The scraper pulls jobs from RapidAPI JSearch using the roles, location, and page settings from `.env`. Every run writes a raw JSON file into `data/raw` and can also upsert the records into Postgres.

Run it manually for a quick check:

```powershell
python scraper/job_scraper.py
```

If you already have a raw JSON file, load it directly into Postgres:

```powershell
python scraper/postgres_store.py data/raw/jobs_20260609_224057.json
```

Initialize the schema when needed:

```powershell
python scraper/postgres_store.py
```

## Database

This project is designed around Postgres, preferably Supabase Postgres for the hosted environment.

Check the data after a run with SQL like this:

```sql
SELECT COUNT(*) FROM jobs;
SELECT job_id, title, company, location, scraped_at FROM jobs LIMIT 10;
```

## Backend

Start the backend API with:

```powershell
uvicorn backend.main:app --reload
```

Backend URLs to open:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/jobs
http://127.0.0.1:8000/jobs/any-job-id
```

The main Postgres-backed routes are:

```text
/jobs
/jobs/{job_id}
/search/jobs
/skills/all
/jobs/match
/recommend
```

The analytics endpoints below are still tied to Spark output paths in the current backend code and should be treated as the unfinished migration area:

```text
/top-skills
/jobs-by-city
/job-trends
/skill-cooccurrence
/job-clusters
```

## Frontend

The frontend is a Next.js app in `frontend/` and talks to the backend through `NEXT_PUBLIC_API_URL`.

Start it locally with:

```powershell
cd frontend
pnpm dev
```

Open the app at:

```text
http://localhost:3000
```

Useful pages include:

```text
/dashboard
/jobs
/recommendations
/trends
/skills
/clusters
/settings
```

## How To See Results

1. Run the Airflow stack and trigger `job_scraping_to_postgres` from the Airflow UI.
2. Confirm rows are in Postgres by querying the `jobs` table or opening your Supabase table viewer.
3. Start the backend and open `/jobs` or `/search/jobs` in the browser to verify API output.
4. Start the frontend and browse the dashboard, jobs, trends, and recommendations pages.

## Notes

- HDFS and Cassandra are not used in the intended final architecture.
- The backend still contains some HDFS-related Spark reads, so those analytics routes are not fully migrated yet.
- `data/raw` is useful for debugging and reloading without consuming API quota.
- Keep API keys in `.env`, not in source code.
