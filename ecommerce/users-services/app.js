const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());

const pool = new Pool({
    host: "db-users",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "postgres",
    port: 5432
});

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT,
            email TEXT,
            password_hash TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
initDB();

// Healthcheck
app.get("/health", (req, res) => res.json({ status: "ok" }));


// GET users
app.get("/users", async (req, res) => {
    const result = await pool.query("SELECT id, username, email, created_at FROM users");
    res.json(result.rows);
});

// POST users
app.post("/users", async (req, res) => {
    const { username, email, password } = req.body;
    await pool.query(
        "INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3)",
        [username, email, password]
    );
    res.status(201).json({ message: "User created" });
});

// POST login des users
app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query(
        "SELECT id FROM users WHERE email=$1 AND password_hash=$2",
        [email, password]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ message: "Login successful", user_id: result.rows[0].id });
});

// Démarrer le serveur
app.listen(5001, "0.0.0.0", () => console.log("Users service running on 5001"));