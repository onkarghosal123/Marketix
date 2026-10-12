import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { axiosInstance } from "../lib/axios";
import { useDispatch } from "react-redux";
import { removeSelectedItems } from "../redux/cartSlice";

function Payment() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedItems, totalPrice, isTotalLoading, createOrder, isPlacingOrder, } = useContext(UserContext);
    const [address, setAddress] = useState({ name: "", mobile: "", address: "" });
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {

        if (!address.name || !address.mobile || !address.address) {
            toast.error("Please complete your address");
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            toast.error("No items selected");
            return;
        }

        const orderData = {
            address,
            paymentMethod,
            calculatedItems: selectedItems,
            frontendTotal: totalPrice.total
        };

        const result = await createOrder(orderData);

        if (!result) {
            return;
        }

        // Get sellerproduct IDs of successfully ordered items
        const orderedIds = selectedItems.map(
            item => item.sellerproduct_id
        );

        // Remove only ordered items from cart
        dispatch(removeSelectedItems(orderedIds));
        
        // then navigate to Order Success page.
        navigate(`/order-success/${result.orderId}`);
    };

    if (isTotalLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading payment details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Payment
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold mb-5">
                                Shipping Address
                            </h2>

                            <div className="space-y-4">

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={address.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    value={address.mobile}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <textarea
                                    name="address"
                                    placeholder="Full Address"
                                    value={address.address}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold mb-5">
                                Payment Method
                            </h2>

                            <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cash on Delivery"
                                    checked={
                                        paymentMethod === "Cash on Delivery"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                />

                                <span className="font-medium">
                                    Cash on Delivery
                                </span>

                            </label>

                            {/* Later */}
                            <label className="flex items-center gap-3 border rounded-lg p-4 mt-3 opacity-50">

                                <input
                                    type="radio"
                                    disabled
                                />

                                <span>
                                    UPI / Card / Net Banking
                                </span>

                                <span className="text-sm text-gray-500">
                                    Coming soon
                                </span>

                            </label>

                        </div>

                        {/* Selected Products */}
                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-semibold mb-5">
                                Order Items
                            </h2>

                            <div className="space-y-4">

                                {selectedItems.map((item) => (
                                    <div
                                        key={item.sellerproduct_id}
                                        className="flex justify-between items-center border-b pb-4"
                                    >

                                        <div>
                                            <p className="font-medium">
                                                {item.product_name}
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                Quantity:{" "}
                                                {item.needed_quantity}
                                            </p>
                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div>
                        <div className="bg-white rounded-xl shadow p-6 sticky top-5">

                            <h2 className="text-xl font-semibold mb-6">
                                Order Summary
                            </h2>

                            <div className="flex justify-between mb-3">
                                <span>Subtotal</span>

                                <span>
                                    ₹{Number(totalPrice?.subtotal || 0).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between mb-3">
                                <span>Delivery</span>

                                <span>
                                    Included
                                </span>
                            </div>

                            <hr className="my-4" />

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>

                                <span>
                                    ₹{Number(totalPrice?.total || 0).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isPlacingOrder
                                    ? "Placing Order..."
                                    : "Place Order"
                                }
                            </button>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Payment;