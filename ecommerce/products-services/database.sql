CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, stock) VALUES
    ('Laptop Dell XPS', 999.99, 5),
    ('Samsung 32" Monitor', 299.99, 10),
    ('Mechanical Keyboard', 129.99, 25),
    ('Gaming Mouse', 49.99, 50);