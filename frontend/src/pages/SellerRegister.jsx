import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SellerContext } from "../contexts/SellerContext";

function SellerRegister() {

    const navigate = useNavigate();

    const { register, isRegistering } = useContext(SellerContext);

    const [formData, setFormData] = useState({
        seller_name: "",
        seller_contact: "",
        seller_email: "",
        seller_password: "",
        seller_location: "",
        seller_city: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await register(formData);
        console.log(success)
        if (success) {
 console.log("Navigating to seller login...");
            navigate("/seller/login");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-lg">

                {/* Heading */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-blue-600">
                        Become a Seller
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create your Marketix seller account
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Seller Name */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seller Name
                            </label>

                            <input
                                type="text"
                                name="seller_name"
                                value={formData.seller_name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                maxLength={30}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        {/* Contact */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Number
                            </label>

                            <input
                                type="tel"
                                name="seller_contact"
                                value={formData.seller_contact}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        seller_contact: e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 15)
                                    }))
                                }
                                placeholder="Enter your contact number"
                                required
                                maxLength={15}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="seller_email"
                                value={formData.seller_email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                maxLength={50}
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
                                name="seller_password"
                                value={formData.seller_password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        {/* Location */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>

                            <textarea
                                name="seller_location"
                                value={formData.seller_location}
                                onChange={handleChange}
                                placeholder="Enter your full address"
                                required
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />

                        </div>

                        {/* City */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>

                            <input
                                type="text"
                                name="seller_city"
                                value={formData.seller_city}
                                onChange={handleChange}
                                placeholder="Enter your city"
                                required
                                maxLength={30}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        {/* Register */}
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isRegistering
                                ? "Creating Account..."
                                : "Create Seller Account"}
                        </button>

                    </form>

                    {/* Login */}
                    <p className="text-center text-sm text-gray-500 mt-6">

                        Already have a seller account?{" "}

                        <button
                            type="button"
                            onClick={() => navigate("/seller/login")}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Login
                        </button>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default SellerRegister;