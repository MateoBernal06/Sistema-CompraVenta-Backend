import dotenv from "dotenv";
import connection from "../src/database.js";
import app from "../src/server.js";

dotenv.config();

let cachedConnection = null;

export default async function handler(req, res) {
    // Handle OPTIONS preflight requests
    if (req.method === "OPTIONS") {
        return app(req, res);
    }

    // Try to establish connection once
    if (!cachedConnection) {
        try {
            cachedConnection = await connection();
        } catch (err) {
            console.error("DB connection error:", err.message);
            // Continue anyway — let Express handle with proper CORS
        }
    }

    return app(req, res);
}
