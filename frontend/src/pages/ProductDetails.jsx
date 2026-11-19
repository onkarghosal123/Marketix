import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import toast from "react-hot-toast";

import { UserContext } from "../contexts/UserContext";
import { addToCart } from "../redux/cartSlice";

function ProductDetails() {
  const { spid } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

const { product, getProductById, isProductLoading, authUser, addCartItem } =
    useContext(UserContext);
  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Fetch product
  useEffect(() => {
    getProductById(spid);
  }, [spid]);

  // Check whether this product is already in cart
  const isAlreadyInCart = cartItems.some((item) => String(item.sellerproduct_id) === String(spid));

  // Add product to cart
const handleAddToCart = async () => {
    if (!authUser) {
        navigate("/login");
        return;
    }

    if (!product) return;

    await addCartItem(product.sellerproduct_id);
};

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Product not found
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Product Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* IMAGE  */}

            <div className="bg-gray-100 min-h-[450px] flex items-center justify-center p-8">

              {product.product_image ? (
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="max-h-[420px] w-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-lg">
                  No Image Available
                </div>
              )}

            </div>

            {/* DETAILS */}

            <div className="p-8 md:p-10">

              {/* Category */}
              <p className="text-sm font-medium text-blue-600 uppercase">
                {product.product_category}
              </p>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {product.product_name}
              </h1>

              {/* Brand */}
              <p className="text-gray-500 mt-3">
                Brand:{" "}
                <span className="font-semibold text-gray-700">
                  {product.product_brand}
                </span>
              </p>

              {/* Sub Category */}
              {product.product_sub_category && (
                <p className="text-gray-500 mt-2">
                  Category:{" "}
                  <span className="font-medium text-gray-700">
                    {product.product_sub_category}
                  </span>
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Price */}
              <div>
                <p className="text-sm text-gray-500">
                  Price
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ₹{product.price_per_unit}
                </p>
              </div>

              {/* Description */}
              <div className="mt-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>

                <p className="text-gray-600 leading-7 mt-2">
                  {product.product_description ||
                    "No description available for this product."}
                </p>

              </div>

              {/* Seller */}
              {product.seller_id && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    Seller
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    Seller #{product.seller_id}
                  </p>
                </div>
              )}

              {/* ================= CART BUTTON ================= */}

              <div className="mt-8">

                {isAlreadyInCart ? (

                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    <Check size={20} />
                    Already Added in Cart  🠮Go to Cart
                  </button>

                ) : (

                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;