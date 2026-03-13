CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES
    (1, 1, 1, 999.99),
    (1, 2, 1, 299.99),
    (1, 3, 1, 129.99),
    (1, 4, 1, 49.99);