from flask import Flask, request, jsonify
import psycopg2
import os

app = Flask(__name__)

conn = psycopg2.connect(
    host="users-db",
    database="postgres",
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD")
)

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/users", methods=["GET"])
def get_users():
    cur = conn.cursor()
    cur.execute("SELECT id, username, email FROM users")
    users = cur.fetchall()
    return jsonify(users)

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username,email,password_hash) VALUES (%s,%s,%s)",
        (data["username"], data["email"], data["password"])
    )
    conn.commit()
    return {"message": "user created"}

@app.route("/users/login", methods=["POST"])
def login():
    data = request.json
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM users WHERE email=%s AND password_hash=%s",
        (data["email"], data["password"])
    )
    user = cur.fetchone()
    if user:
        return {"message": "login success"}
    return {"error": "invalid"}, 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)