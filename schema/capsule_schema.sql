-- Database Schema for Time Capsule Module

CREATE TABLE IF NOT EXISTS capsules (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_public BOOLEAN DEFAULT true,
    is_revealed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance on reveal checks
CREATE INDEX idx_capsules_unlock ON capsules(unlock_date, is_revealed);
