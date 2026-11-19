import bcrypt from "bcryptjs";
import { db } from "./src/config/dbconnection.js";

const seedAdmin = async () => {
    try {
        const name = "Priam Ghosh";
        const contact = 1234567890;
        const email = "priam@email.com";
        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO admin (admin_name,contact,email, admin_password)
             VALUES ($1, $2,$3,$4)
             ON CONFLICT (email) DO NOTHING`,
            [name,contact,email, hashedPassword]
        );

        console.log("Admin seeded successfully");

    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await db.end();
    }
};

seedAdmin();