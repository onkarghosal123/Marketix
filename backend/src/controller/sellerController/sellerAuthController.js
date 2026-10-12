import { db } from "../../config/dbconnection.js";
import bcrypt from "bcryptjs";
import { sellerCookie } from "../../config/setCookie.js";

export const sellerRegister = async (req, res) => {
    try {

        const {
            seller_name,
            seller_contact,
            seller_email,
            seller_password,
            seller_location,
            seller_city
        } = req.body;


        // Required fields
        if (
            !seller_name?.trim() ||
            !seller_contact?.trim() ||
            !seller_email?.trim() ||
            !seller_password ||
            !seller_location?.trim() ||
            !seller_city?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }


        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(seller_email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }


        // Password validation
        if (seller_password.length < 6) {
            return res.status(400).json({
                message: "Password should be at least 6 characters."
            });
        }


        // Check existing seller
        const existingSeller = await db.query(
            `SELECT seller_id
             FROM seller
             WHERE seller_email = $1`,
            [seller_email]
        );

        if (existingSeller.rows.length > 0) {
            return res.status(400).json({
                message: "Seller already exists. Please login."
            });
        }


        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            seller_password,
            salt
        );


        // Insert seller
        const result = await db.query(
            `INSERT INTO seller
    (
        seller_name,
        seller_contact,
        seller_email,
        seller_password,
        seller_location,
        seller_city,
        seller_registration_date,
        seller_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
        seller_id,
        seller_name,
        seller_contact,
        seller_email,
        seller_location,
        seller_city,
        seller_registration_date,
        seller_status`,
            [
                seller_name.trim(),
                seller_contact.trim(),
                seller_email.trim().toLowerCase(),
                hashedPassword,
                seller_location.trim(),
                seller_city.trim(),
                new Date(),
                "pending"
            ]
        );


        return res.status(201).json({
            message: "Seller account created successfully. Please login.",
            seller: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Seller registration error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
export const sellerSendOtp = async (req, res) => {
    try {
        const { seller_email, seller_password } = req.body;
        console.log("email from sendotp backend", seller_email)
        if (!seller_email || !seller_password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        console.log("email:", seller_email);
        console.log("pass:", seller_password)
        const result = await db.query(
            "SELECT * FROM seller WHERE seller_email = $1",
            [seller_email]
        ); //result gives an object 

        const existingSeller = result.rows; // its an array

        if (existingSeller.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const seller = existingSeller[0];
        console.log(seller)
        const isPassCorrect = await bcrypt.compare(seller_password, seller.seller_password);
        if (!isPassCorrect) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }
        //generate otp
        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000)//valid for 5 min
        console.log(generatedOtp);
        await db.query(
            `UPDATE seller
             SET otp = $1, otp_expire = $2
             WHERE seller_email = $3`,
            [generatedOtp, otpExpire, seller.seller_email]
        );
        //send email otp(email,otp)
        res.status(201).json({ seller_email: seller.seller_email })
    } catch (error) {
        console.log("error in sellerSendOtp controller.", error)
        res.status(400).json({ message: "Internal server Error" })

    }
}
export const sellerLogin = async (req, res) => {
    try {
        const { seller_email, otp } = req.body;
        console.log(seller_email, otp)
        //otp should be varchar means string when i send from frontend becoz in db user's otp save as a varchar
        const result = await db.query("SELECT * FROM seller WHERE seller_email=$1", [seller_email])
        const existingSeller = result.rows; // its an array
        if (existingSeller.length === 0) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }

        const seller = existingSeller[0];
        console.log("Seller is", seller)
        if (Date.now() > new Date(seller.otp_expire).getTime()) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        if (otp !== seller.otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        await db.query("UPDATE seller SET otp =NULL,otp_expire=NULL WHERE seller_email=$1", [seller.seller_email]);
        //set cookie
        sellerCookie(seller.seller_email, res);
        console.log("logged in succesfully");
        res.status(201).json({
            message: "Logged in successfully",
            seller: {
                seller_id: seller.seller_id,
                seller_name: seller.seller_name,
                seller_contact: seller.seller_contact,
                seller_email: seller.seller_email,
                seller_location: seller.seller_location,
                seller_city: seller.seller_city,
                seller_registration_date: seller.seller_registration_date,
                seller_status: seller.seller_status,
                seller_rejection_reason:seller.rejection_reason
            }
        });

    } catch (error) {
        console.log("error in sellerLogin controller.", error)
        res.status(400).json({ message: "Internal server Error" })

    }
}
export const getSeller = async (req, res) => {
    try {

        const sellerId = req.seller.seller_id;

       const result = await db.query(
    `SELECT 
        seller_id,
        seller_name,
        seller_contact,
        seller_email,
        seller_location,
        seller_city,
        seller_registration_date,
        seller_status,
        rejection_reason
     FROM seller
     WHERE seller_id = $1`,
    [sellerId]
);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        return res.status(200).json({
            seller: result.rows[0]
        });

    } catch (error) {

        console.error("Get Seller Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
export const sellerLogout = async (req, res) => {
    try {
        res.cookie("sellerToken", "", { maxAge: 0 })
            .status(200)
            .json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};