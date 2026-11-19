import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function UserSignup() {
  const { signup, isSigningUp } = useContext(UserContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_contact: "",
    user_password: "",
    user_location: "",
    user_city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]:e.target.value,  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await signup(formData);

    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Create your Marketix account
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="user_contact"
                value={formData.user_contact}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="user_password"
                value={formData.user_password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="user_location"
                value={formData.user_location}
                onChange={handleChange}
                placeholder="Enter your location"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>

              <input
                type="text"
                name="user_city"
                value={formData.user_city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningUp ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default UserSignup;