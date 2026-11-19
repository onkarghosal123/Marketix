import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({
    title,
    subtitle,
    emailName,
    passwordName,
    onSendOtp,
    onLogin,
    otpSending,
    isLoggingIn,
    signupPath,
    showSignup = false,
    loginPath
}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();

        const data = {
            [emailName]: email,
            [passwordName]: password
        };

        const success = await onSendOtp(data);

        if (success) {
            setOtpSent(true);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            [emailName]: email,
            otp
        };

        const success = await onLogin(data);

        if (success && loginPath) {
            navigate(loginPath, { replace: true });
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                {/* Heading */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-blue-600">
                        {title}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {subtitle}
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {!otpSent ? (

                        /* STEP 1 */
                        <form
                            onSubmit={handleSendOtp}
                            className="space-y-5"
                        >

                            {/* Email */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                            </div>

                            {/* Password */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                            </div>

                            {/* Send OTP */}
                            <button
                                type="submit"
                                disabled={otpSending}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {otpSending
                                    ? "Sending OTP..."
                                    : "Send OTP"}
                            </button>

                        </form>

                    ) : (

                        /* STEP 2 */
                        <form
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >

                            <div className="text-center mb-5">

                                <p className="text-sm text-gray-500">
                                    OTP sent to
                                </p>

                                <p className="font-medium">
                                    {email}
                                </p>

                            </div>

                            {/* OTP */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    placeholder="Enter 6 digit OTP"
                                    maxLength={6}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-[0.5em]"
                                />

                            </div>

                            {/* Login */}
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoggingIn
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>

                    )}

                    {/* Signup */}
                    {showSignup && !otpSent && (
                        <p className="text-center text-sm text-gray-500 mt-6">

                            Don't have an account?{" "}

                            <button
                                type="button"
                                onClick={() => navigate(signupPath)}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Sign up
                            </button>

                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default LoginForm;