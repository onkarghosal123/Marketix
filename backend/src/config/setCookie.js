import jwt from "jsonwebtoken"
import { ENV } from "./env.js"

export const userCookie = (email, res) => {
    try {

        const jwt_secret = ENV.JWT_SECRET;
        if (!jwt_secret) {
            console.log("jwt_secret unavailable")
            throw new Error("jwt_secret unavailable")
        }
        const token = jwt.sign({ email }, jwt_secret, { expiresIn: "5d" });
        if (token) {
            res.cookie("userToken", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // MS
                httpOnly: true, // prevent XSS attacks: cross-site scripting
                sameSite: ENV.NODE_ENV === "development" ? "lax" : "none", // CSRF attacks
                secure: ENV.NODE_ENV === "development" ? false : true,
                path: '/'
            });
        }
        console.log("cookie set for user");

    } catch (error) {
        console.log("Error in userCookie", error);
        res.status(400).json({ message: "Internal server Error" })
    }
}

export const adminCookie = (email, res) => {
    try {
        const jwt_secret = ENV.JWT_SECRET;
        if (!jwt_secret) {
            console.log("jwt_secret unavailable")
            throw new Error("jwt_secret unavailable")
        }
        const token = jwt.sign({ email }, jwt_secret, { expiresIn: "5d" });
        res.cookie("adminToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks: cross-site scripting
            sameSite: "lax", // CSRF attacks
            secure: ENV.NODE_ENV === "development" ? false : true,
            path: '/'
        })
        console.log("cookie set for admin.");
    } catch (error) {
        console.log("Error in adminCookie", error);
        res.status(400).json({ message: "Internal server Error" })

    }
}

export const sellerCookie = (email, res) => {
    try {

        const jwt_secret = ENV.JWT_SECRET;
        if (!jwt_secret) {
            console.log("jwt_secret unavailable")
            throw new Error("jwt_secret unavailable")
        }
        const token = jwt.sign({ email }, jwt_secret, { expiresIn: "5d" });
        res.cookie("sellerToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks: cross-site scripting
            sameSite: "lax", // CSRF attacks
            secure: ENV.NODE_ENV === "development" ? false : true,
            path: '/'
        })
        console.log("cookie set for seller.");
    } catch (error) {
        console.log("Error in sellerCookie", error);
        res.status(400).json({ message: "Internal server Error" })

    }
}