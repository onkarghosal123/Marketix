import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    FRONTEND_APP_URL: process.env.FRONTEND_APP_URL
}