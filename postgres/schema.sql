CREATE TABLE IF NOT EXISTS jobs (
    job_id TEXT PRIMARY KEY,
    title TEXT,
    company TEXT,
    location TEXT,
    country TEXT,
    employment_type TEXT,
    description TEXT,
    apply_link TEXT,
    posted_at TIMESTAMPTZ,
    salary_min NUMERIC,
    salary_max NUMERIC,
    is_remote BOOLEAN,
    skills_raw TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    scraped_role TEXT,
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs (company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_scraped_role ON jobs (scraped_role);
CREATE INDEX IF NOT EXISTS idx_jobs_skills_raw ON jobs USING GIN (skills_raw);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_jobs_search
    ON jobs USING GIN (
        to_tsvector(
            'english',
            coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(description, '')
        )
    );
