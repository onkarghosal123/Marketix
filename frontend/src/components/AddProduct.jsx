import React, { useContext, useState } from "react";
import { AdminContext } from "../contexts/AdminContext";

function AddProduct({ setProductState }) {

    const {
        addProduct,
        isAddingProduct
    } = useContext(AdminContext);

    const [formData, setFormData] = useState({
        product_name: "",
        product_category: "",
        product_sub_category: "",
        product_brand: "",
        product_description: ""
    });

    const handleChange = (e) => {

        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await addProduct(formData);

        if (result) {

            setFormData({
                product_name: "",
                product_category: "",
                product_sub_category: "",
                product_brand: "",
                product_description: "",
            });

        }
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Product
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Add a new product to Marketix
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setProductState("all-products")}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                    ← Back to Products
                </button>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-xl p-5"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category
                        </label>

                        <input
                            type="text"
                            name="product_category"
                            value={formData.product_category}
                            onChange={handleChange}
                            placeholder="Enter category"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Sub Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Sub Category
                        </label>

                        <input
                            type="text"
                            name="product_sub_category"
                            value={formData.product_sub_category}
                            onChange={handleChange}
                            placeholder="Enter sub category"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Brand
                        </label>

                        <input
                            type="text"
                            name="product_brand"
                            value={formData.product_brand}
                            onChange={handleChange}
                            placeholder="Enter brand"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>

                        <input
                            type="text"
                            name="product_description"
                            value={formData.product_description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            required
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isAddingProduct}
                    className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isAddingProduct ? "Adding..." : "Add Product"}
                </button>

            </form>

        </div>
    );
}

export default AddProduct;