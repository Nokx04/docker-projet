CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash) VALUES
    ('alex', 'alex@example.com', 'hash1'),
    ('jacques', 'jacques@example.com', 'hash2'),
    ('paul', 'paul@example.com', 'hash3'),
    ('raphael', 'raphael@example.com', 'hash4');