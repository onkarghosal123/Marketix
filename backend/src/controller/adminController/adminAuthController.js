import { db } from "../../config/dbconnection.js";
import bcrypt from "bcryptjs";
import { adminCookie } from "../../config/setCookie.js";

export const adminSendOtp = async (req, res) => {
    try {
        const { admin_email, admin_password } = req.body;
        if (!admin_email || !admin_password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        console.log("admin_email:", admin_email);
        console.log("admin_pass:", admin_password)
        const result = await db.query(
            "SELECT * FROM admin WHERE email = $1",
            [admin_email]
        ); //result gives an object 

        const existingUser = result.rows; // its an array

        if (existingUser.length === 0) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const user = existingUser[0];
        console.log(user)
        const isPassCorrect = await bcrypt.compare(admin_password, user.admin_password);
        if (!isPassCorrect) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }
        //generate otp
        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000)//valid for 5 min
        console.log(generatedOtp);
        await db.query(
            `UPDATE admin
             SET otp = $1, otp_expire = $2
             WHERE email = $3`,
            [generatedOtp, otpExpire, user.email]
        );
        //send email otp(email,otp)
        res.status(201).json({ email: user.email })
    } catch (error) {
        console.log("error in adminSendOtp controller.", error)
        res.status(400).json({ message: "Internal server Error" })

    }
};

export const adminLogin = async (req, res) => {
    try {
        const { admin_email, otp } = req.body;
        console.log(admin_email, otp)
        //otp should be varchar means string when i send from frontend becoz in db user's otp save as a varchar
        const result = await db.query("SELECT * FROM admin WHERE email=$1", [admin_email])
        const existingUser = result.rows; // its an array
        console.log(existingUser)
        if (existingUser.length === 0) {
            return res.status(400).json({ message: "Inavlid credentials" })
        }

        const user = existingUser[0];
        console.log("User ", user)
        if (Date.now() > new Date(user.otp_expire).getTime()) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        if (otp !== user.otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        await db.query("UPDATE admin SET otp =NULL,otp_expire=NULL WHERE EMAIL=$1", [user.email]);

        adminCookie(user.email, res);
        console.log("logged in succesfully");
        res.status(201).json({
            message: "Logged in succesfully",
            user: {
                id: user.admin_id,
                fullName: user.admin_name,
                email: user.email,
                contact: user.contact
            }
        })


    } catch (error) {
        console.log("error in adminLogin controller.", error)
        res.status(400).json({ message: "Internal server Error" })

    }
};

export const getAdmin = async (req, res) => {
    try {

        const adminId = req.admin.admin_id;

        const result = await db.query(
            `SELECT
                admin_id,
                admin_name,
                email
             FROM admin
             WHERE admin_id = $1`,
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            admin: result.rows[0]
        });

    } catch (error) {

        console.error("Get Admin Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const logoutAdmin = async (req, res) => {
    try {
        res.cookie("adminToken", "", { maxAge: 0 })
            .status(200)
            .json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
