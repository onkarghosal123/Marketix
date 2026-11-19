import nodemailer from "nodemailer";
import dns from "node:dns";
import { ENV } from "./env.js";
import {
    createWelcomeEmailTemplate,
    otpEmailTemplate
} from "./emailTemplate.js";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
});

// Verify SMTP configuration when the server starts
transporter.verify()
    .then(() => console.log("Email server is ready"))
    .catch(error => console.error("Email server connection failed:", error.message));

// Send welcome email
export const welcomeEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: `"MARKETIX" <${ENV.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to MARKETIX!",
            html: createWelcomeEmailTemplate(name, ENV.FRONTEND_APP_URL)
        });

        console.log("Welcome email sent successfully.");
    } catch (error) {
        console.error("Error sending welcome email:", error.message);
    }
};

// Send OTP email
export const otpEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"MARKETIX" <${ENV.EMAIL_USER}>`,
            to: email,
            subject: "OTP for MARKETIX verification",
            html: otpEmailTemplate(otp)
        });

        console.log("OTP email sent successfully.");
    } catch (error) {
        console.error("Error sending OTP email:", error.message);
    }
}; 