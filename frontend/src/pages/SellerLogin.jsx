import React, { useContext } from "react";
import LoginForm from "../components/LoginForm";
import { SellerContext } from "../contexts/SellerContext";

function SellerLogin() {
    const {
        sendOtp,
        login,
        otpSending,
        isLoggingIn
    } = useContext(SellerContext);

    return (
        <LoginForm
            title="Seller Login"
            subtitle="Login to your Marketix seller account"

            emailName="seller_email"
            passwordName="seller_password"

            onSendOtp={sendOtp}
            onLogin={login}

            otpSending={otpSending}
            isLoggingIn={isLoggingIn}

           signupPath="/seller/register"
            showSignup={true}
            loginPath="/seller/dashboard"
        />
    );
}

export default SellerLogin;