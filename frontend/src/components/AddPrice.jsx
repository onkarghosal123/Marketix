import React, { useContext, useState } from "react";
import { SellerContext } from "../contexts/SellerContext";

function AddPrice({ selectedProduct, setProductState, isEdit = false }) {
    const {
        addPrice,
        updatePrice,
        isAddingPrice,
        isUpdatingPrice
    } = useContext(SellerContext);

    const [formData, setFormData] = useState({
        price_per_unit: selectedProduct?.price_per_unit || "",
        available_quantity: selectedProduct?.available_quantity || ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            product_id: selectedProduct.product_id,
            price_per_unit: formData.price_per_unit,
            available_quantity: formData.available_quantity
        };

        let success;

        if (isEdit) {
            success = await updatePrice(data);
        } else {
            success = await addPrice(data);
        }

        if (success) {
            setProductState(
                isEdit ? "seller-products" : "all-products"
            );
        }
    };

    return (
        <div className="max-w-xl">
            <div className="mb-6">
                <button
                    onClick={() =>
                        setProductState(
                            isEdit ? "seller-products" : "all-products"
                        )
                    }
                    className="text-blue-600 hover:underline mb-4"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold text-gray-800">
                    {isEdit ? "Edit Price" : "Add Price"}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    {isEdit
                        ? "Update your price and available quantity"
                        : "Add your price and available quantity"}
                </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4 mb-5">
                <h2 className="font-semibold text-gray-800">
                    {selectedProduct?.product_name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    {selectedProduct?.product_category}
                </p>

                <p className="text-sm text-gray-500">
                    Brand: {selectedProduct?.product_brand}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border p-6 space-y-5"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Per Unit
                    </label>

                    <input
                        type="number"
                        name="price_per_unit"
                        value={formData.price_per_unit}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Quantity
                    </label>

                    <input
                        type="number"
                        name="available_quantity"
                        value={formData.available_quantity}
                        onChange={handleChange}
                        min="0"
                        required
                        className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() =>
                            setProductState(
                                isEdit ? "seller-products" : "all-products"
                            )
                        }
                        className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isAddingPrice || isUpdatingPrice}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isAddingPrice || isUpdatingPrice
                            ? isEdit
                                ? "Updating..."
                                : "Adding..."
                            : isEdit
                                ? "Update Price"
                                : "Add Price"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddPrice;