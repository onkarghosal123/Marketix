import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SellerContext } from "../contexts/SellerContext";

function SellerEdit() {
    const navigate = useNavigate();

    const {
        seller,
        isSellerLoading,
        updateSellerApplication
    } = useContext(SellerContext);

   const [formData, setFormData] = useState({
    seller_name: "",
    seller_contact: "",
    seller_email: "",
    seller_city: "",
    seller_location: ""
});
useEffect(() => {
    if (seller) {
        setFormData({
            seller_name: seller.seller_name || "",
            seller_contact: seller.seller_contact || "",
            seller_email: seller.seller_email || "",
            seller_city: seller.seller_city || "",
            seller_location: seller.seller_location || ""
        });
    }
}, [seller]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If seller data is loading
    if (isSellerLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // No seller found
    if (!seller) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Seller application not found.
                    </p>

                    <button
                        onClick={() => navigate("/seller/register")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Register as Seller
                    </button>
                </div>
            </div>
        );
    }

    // Only rejected seller can edit
    if (seller.seller_status !== "rejected") {
        navigate("/seller/dashboard",);
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const success = await updateSellerApplication(formData);

            if (success) {
                navigate("/seller/dashboard");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-10 px-4">

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Seller Application
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Update your information and resubmit your application.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Seller Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Seller Name
                        </label>

                        <input
                            type="text"
                            name="seller_name"
                            value={formData.seller_name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Contact */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contact
                        </label>

                        <input
                            type="text"
                            name="seller_contact"
                            value={formData.seller_contact}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="seller_email"
                            value={formData.seller_email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City
                        </label>

                        <input
                            type="text"
                            name="seller_city"
                            value={formData.seller_city}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                        </label>

                        <textarea
                            name="seller_location"
                            value={formData.seller_location}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">

                        <button
                            type="button"
                            onClick={() => navigate("/seller/dashboard")}
                            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Application"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default SellerEdit;