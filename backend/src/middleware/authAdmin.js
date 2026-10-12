import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";
import { db } from "../config/dbconnection.js";

export const checkAuthAdmin = async (req, res, next) => {
    try {
        const jwt_secret = ENV.JWT_SECRET;
        console.log(req.cookies)
        const token = req.cookies?.adminToken;
        if (!token) {
            return res.status(400).json({ message: "Please Login !" })
        }
        const decoded = jwt.verify(token, jwt_secret);
        if (!decoded) {
            return res.status(400).json({ message: "Not verified user" })
        }
        const result = await db.query("select * from ADMIN WHERE email = $1",[decoded.email])
        const existingUser = result.rows;
        if (existingUser.length === 0) {
            return res.status.json({ message: "Invalid data! User not found." })

        }
        req.admin = existingUser[0];
        next();
    } catch (error) {
        console.log("error in checkauthadmin", error);
        res.status(400).json({ message: "internal server error" })
    }

}