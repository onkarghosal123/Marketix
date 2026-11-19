import bcrypt from "bcryptjs";
import { db } from "./src/config/dbconnection.js";

const seedSeller = async () => {
    try {
    const name = "Style Bazar";
    const contact = 1234567890;
    const email = "stylebazar@email.com";
    const password = "stylebazar123";
    const location = "Beliatore,Barjora";
    const city = "Bankura";

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        `
        INSERT INTO seller
        (
            seller_name,
            seller_contact,
            seller_email,
            seller_password,
            seller_location,
            seller_city,
            seller_registration_date
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (seller_email) DO NOTHING
        `,
        [
            name,
            contact,
            email,
            hashedPassword,
            location,
            city
        ]
    );

    console.log("Seller seeded successfully");

} catch (error) {
        console.error("seedSeller error:", error);
    } finally {
        await db.end();
    }
};

seedSeller();