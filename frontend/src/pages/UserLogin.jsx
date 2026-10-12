import React, { useContext } from "react";
import LoginForm from "../components/LoginForm";
import { UserContext } from "../contexts/UserContext";

function UserLogin() {
    const {
        sendOtp,
        login,
        otpSending,
        isLoggingIn
    } = useContext(UserContext);

    return (
        <LoginForm
            title="Welcome Back"
            subtitle="Login to your Marketix account"

            emailName="user_email"
            passwordName="user_password"

            onSendOtp={sendOtp}
            onLogin={login}

            otpSending={otpSending}
            isLoggingIn={isLoggingIn}

            signupPath="/signup"
            showSignup={true}
            loginPath="/"
        />
    );
}

export default UserLogin;