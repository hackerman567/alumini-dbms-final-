-- Job Board & Application Tracking
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    posted_by INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    type VARCHAR(50),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    salary_range VARCHAR(100),
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES job_postings(id),
    applicant_id INTEGER REFERENCES users(id),
    cover_letter TEXT,
    resume_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);
