CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO products (name) VALUES
      ('Alex'),
      ('Jacques'),
      ('Paul'),
      ('Raphaël');