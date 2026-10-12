import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SellerContext } from "../contexts/SellerContext";

function SellerAccountStatus({ status, reason }) {
    const navigate = useNavigate();
    const { logout } = useContext(SellerContext);

    const isPending = status === "pending";
    const isRejected = status === "rejected";

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 text-center">

                <div className="text-5xl mb-5">
                    {isPending ? "⏳" : "❌"}
                </div>

                <h1 className="text-2xl font-bold text-gray-800">
                    {isPending
                        ? "Your Application Is Under Review"
                        : "Seller Application Rejected"}
                </h1>

                {isPending && (
                    <>
                        <p className="text-gray-500 mt-4 leading-6">
                            Your seller application has been submitted
                            successfully and is currently under review
                            by our admin team.
                        </p>

                        <p className="text-gray-500 mt-3">
                            You will get access to your seller dashboard
                            once your application is approved.
                        </p>
                    </>
                )}

                {isRejected && (
                    <>
                        <p className="text-gray-500 mt-4">
                            Your seller application has been rejected.
                        </p>

                        <div className="mt-5 bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                            <p className="text-sm font-semibold text-red-700 mb-1">
                                Reason from Admin
                            </p>

                            <p className="text-gray-700">
                                {reason || "No reason was provided."}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/seller/edit")}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Edit Application
                        </button>
                    </>
                )}

                <div className="mt-4">
                    <button
                        onClick={() => navigate("/")}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Back to Marketix
                    </button>

                    <button
                        onClick={handleLogout}
                        className="ml-4 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SellerAccountStatus;