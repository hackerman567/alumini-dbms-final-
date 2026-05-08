-- Achievement & Badge Tracking
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    badge_key VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100),
    badge_desc TEXT,
    awarded_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_key)
);
