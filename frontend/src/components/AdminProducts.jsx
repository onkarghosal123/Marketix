import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../contexts/AdminContext";
import AddProduct from "./AddProduct";

function Products() {
    const { products, isProductsLoading, getAllProducts } = useContext(AdminContext);
    const [productState, setProductState] = useState("all-products");

    useEffect(() => {
        if (productState === "all-products") {
            getAllProducts();
        }
    }, [productState]);


    if (productState === "add-product") {
        return (
            <AddProduct setProductState={setProductState} />
        );
    }

    if (isProductsLoading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Products
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Manage all products
                    </p>
                </div>

                <button
                    onClick={() => setProductState("add-product")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    ID
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Product Name
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Category
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Sub Category
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Brand
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products?.length > 0 ? (
                                products.map((product) => (
                                    <tr
                                        key={product.product_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-3">
                                            {product.product_id}
                                        </td>

                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {product.product_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_category}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_sub_category}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_brand}
                                        </td>

                                        <td className="px-5 py-3">
                                            <button className="text-blue-600 hover:underline mr-4">
                                                Edit
                                            </button>

                                            <button className="text-red-600 hover:underline">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
}

export default Products;