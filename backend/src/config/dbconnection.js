import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const db = new Pool({
    connectionString: process.env.DB_STRING,
});

export const dbConnect = async () => {
    console.log("DB_STRING exists:", !!process.env.DB_STRING);
    console.log("DB host:", new URL(process.env.DB_STRING).hostname);
    console.log("DB port:", new URL(process.env.DB_STRING).port);
    console.log("DB database:", new URL(process.env.DB_STRING).pathname);
    try {
        const client = await db.connect();

        console.log("Database connected successfully");

        client.release();
    } catch (error) {
        console.log("db fail error:", error)
        console.error("Database connection failed:", error.message);
    }
};

