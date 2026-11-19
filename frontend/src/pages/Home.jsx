import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { ShoppingCart } from "lucide-react";

function Home() {
    const { isAllProductLoading, allProducts, getAllProducts } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome to Marketix
                    </h1>

                    <p className="mt-3 text-gray-600 text-lg">
                        Find the products you need at the best prices.
                    </p>

                    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg
                             hover:bg-blue-700 transition">
                        Shop Now
                    </button>
                </div>
            </section>

            {/* Products Section */}
            <section className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Latest Products
                    </h2>

                    <span className="text-gray-500">
                        {allProducts?.length || 0} products
                    </span>
                </div>

                {/* Loading */}
                {isAllProductLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-300
                            border-t-blue-600 rounded-full animate-spin">
                        </div>
                    </div>
                ) : allProducts?.length === 0 ? (

                    /* No Products */
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-700">
                            No products available
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Please check again later.
                        </p>
                    </div>

                ) : (

                    /* Product Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {allProducts?.map((product) => (
                            <div
                                key={product.sellerproduct_id}
                                onClick={() =>
                                    navigate(`/product/${product.sellerproduct_id}`)
                                }
                                className="bg-white rounded-xl border border-gray-200
               overflow-hidden hover:shadow-lg transition
               cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="h-52 bg-gray-100 flex items-center justify-center">
                                    {product.product_image ? (
                                        <img
                                            src={product.product_image}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400">
                                            No Image
                                        </span>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-5">

                                    <p className="text-sm text-blue-600 font-medium">
                                        {product.product_category}
                                    </p>

                                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                        {product.product_name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {product.product_brand}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mt-5">
                                        <span className="text-xl font-bold text-gray-900">
                                            ₹{product.min_price}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </section>
        </div>
    );
}

export default Home;