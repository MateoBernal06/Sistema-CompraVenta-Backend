import dotenv from "dotenv";
import connection from "../src/database.js";
import app from "../src/server.js";

dotenv.config();

export default async function handler(req, res) {
    try {
        await connection();
    } catch (err) {
        console.error("DB connection error:", err);
        res.statusCode = 500;
        res.end("Database connection error");
        return;
    }

    return app(req, res);
}
