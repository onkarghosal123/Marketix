import { db } from "../config/dbconnection.js";
import bcrypt from "bcryptjs";
import { userCookie } from "../config/setCookie.js";
import { welcomeEmail,otpEmail } from "../config/sendEmail.js";

export const register = async (req, res) => {
    try {
        const {
            user_name,
            user_contact,
            user_email,
            user_password,
            user_location,
            user_city
        } = req.body;

        if (
            !user_name?.trim() ||
            !user_contact?.trim() ||
            !user_email?.trim() ||
            !user_password ||
            !user_location?.trim() ||
            !user_city?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        //check valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        //pass check
        if (user_password.length < 6) {
            return res.status(400).json({ message: "password should be 6 character." })
        }

        // user exist alreday ?
        const result = await db.query(
            "SELECT user_email FROM USERS WHERE user_email=$1",
            [user_email]
        )

        const existingUser = result.rows

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exist.Please login" })
        }

        //hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt)

        //insert into db
        await db.query(
            `INSERT INTO USERS
            (user_name, user_contact, user_email, user_password, user_location, user_city, user_created_at, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                user_name,
                user_contact,
                user_email,
                hashedPassword,
                user_location,
                user_city,
                new Date(),
                true
            ]
        )

        const userResult = await db.query(
            "SELECT user_name,user_email,user_contact,user_location,user_city,user_created_at,is_active FROM USERS WHERE user_email=$1",
            [user_email]
        );

        const existingUserResult = userResult.rows;

        if (existingUserResult.length > 0) {
            const user = existingUserResult[0];

            //send welcome email
            await welcomeEmail(user.user_email, user.user_Name)

        }

        console.log("Register succesfully from register controller")

        res.status(201).json({
            message: "Account created succesfully",
            user: existingUserResult[0],
        })

    } catch (error) {
        console.log("error in register controller.", error)
        res.status(400).json({ message: "Internal server Error" })
    }
}

export const sendOtp = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        if (!user_email || !user_password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const result = await db.query(
            "SELECT * FROM USERS WHERE user_email=$1",
            [user_email]
        )

        const existingUser = result.rows;

        if (existingUser.length === 0) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }

        const user = existingUser[0];

        const isPassCorrect = await bcrypt.compare(
            user_password,
            user.user_password
        );
        if (!isPassCorrect) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }

        //generate otp
        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000)//valid for 5 min

        console.log(generatedOtp);

        await db.query(
            "UPDATE USERS SET otp = $1, otpExpire = $2 WHERE user_email = $3",
            [generatedOtp, otpExpire, user.user_email]
        );

        //send email otp(email,otp)
        await otpEmail(user.user_email, generatedOtp)

        res.status(201).json({ email: user.user_email })

    } catch (error) {
        console.log("error in sendotp controller.", error)
        res.status(400).json({ message: "Internal server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { user_email, otp } = req.body;

        const result = await db.query(
            "SELECT * FROM USERS WHERE user_email=$1",
            [user_email]
        )

        const existingUser = result.rows

        if (existingUser.length === 0) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }

        const user = existingUser[0];

        if (Date.now() > new Date(user.otp_expire).getTime()) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        if (String(otp) !== String(user.otp)) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        await db.query(
            "UPDATE USERS SET otp = NULL, otpexpire = NULL WHERE user_email=$1",
            [user.user_email]
        );

        userCookie(user.user_email, res);

        console.log("logged in succesfully");

        res.status(201).json({
            message: "Logged in succesfully",
            user: {
                user_name: user.user_name,
                user_email: user.user_email,
                user_contact: user.user_contact,
                user_location: user.user_location,
                user_city: user.user_city,
                user_created_at: user.user_created_at,
                is_active: user.is_active
            }
        })

    } catch (error) {
        console.log("error in login controller.", error)
        res.status(400).json({ message: "Internal server Error" })
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const result = await db.query(
            `SELECT user_id, user_name, user_contact, user_email, user_location, user_city
             FROM users
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Get User Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.cookie("userToken", "", { maxAge: 0 })
            .status(200)
            .json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

