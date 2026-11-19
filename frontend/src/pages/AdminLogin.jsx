import React, { useContext } from "react";
import LoginForm from "../components/LoginForm";
import { AdminContext } from "../contexts/AdminContext";

function AdminLogin() {

    const {
        sendOtp,
        login,
        otpSending,
        isLoggingIn
    } = useContext(AdminContext);


    return (
        <LoginForm
            title="Admin Login"
            subtitle="Login to Marketix Admin Panel"

            emailName="admin_email"
            passwordName="admin_password"

            onSendOtp={sendOtp}
            onLogin={login}

            otpSending={otpSending}
            isLoggingIn={isLoggingIn}

            showSignup={false}
        />
    );
}

export default AdminLogin;