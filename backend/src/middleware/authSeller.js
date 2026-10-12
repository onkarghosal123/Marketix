import { ENV } from "../config/env.js";
import jwt from "jsonwebtoken";
import { db } from "../config/dbconnection.js";

export const checkAuthSeller= async (req, res, next) => {
    try {
        const jwt_secret = ENV.JWT_SECRET;
        console.log(req.cookies)
        const token = req.cookies?.sellerToken;
        if (!token) {
            return res.status(400).json({ message: "Please Login !" })
        }
        const decoded = jwt.verify(token, jwt_secret);
        if (!decoded) {
            return res.status(400).json({ message: "Not verified user" })
        }
        const result = await db.query("select * from seller WHERE seller_email = $1",[decoded.email])
        const existingSeller = result.rows;
        if (existingSeller.length === 0) {
            return res.status.json({ message: "Invalid data! User not found." })

        }
        req.seller = existingSeller[0];
        next();
    } catch (error) {
        console.log("error in checkAuthSeller", error);
        res.status(400).json({ message: "Internal server error" })
    }

}