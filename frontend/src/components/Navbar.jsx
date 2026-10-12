
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext.jsx";

function Navbar() {

    const navigate = useNavigate();

    const { authUser, logout } = useContext(UserContext);

    const cartItems = useSelector((state) => state.cart.cartItems);

    const handleLogout = async () => {
        const success = await logout();
        navigate("/")
    };

    return (
        <nav className="bg-white border-b shadow-sm">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

                {/* Project Name */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600"
                >
                    Marketix
                </Link>


                {/* Search */}
                <div className="flex-1 max-w-xl relative">

                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full border border-gray-300 rounded-lg
                                   pl-10 pr-4 py-2.5
                                   outline-none
                                   focus:ring-2 focus:ring-blue-500
                                   focus:border-blue-500"
                    />

                </div>


               {/* Right Side */}
<div className="flex items-center gap-5">

    {/* Cart */}
    <Link
        to="/cart"
        className="relative text-gray-700 hover:text-blue-600"
    >

        <ShoppingCart size={25} />

        <span
            className="absolute -top-2 -right-2
                       bg-red-500 text-white text-xs
                       w-5 h-5 rounded-full
                       flex items-center justify-center"
        >
            {cartItems.length}
        </span>

    </Link>


    {/* Become a Seller */}
    <button
        onClick={() => navigate("/seller/login")}
        className="font-medium text-gray-700 hover:text-blue-600 transition cursor-pointer"
    >
        Become a Seller
    </button>


    {/* Logged OUT */}
    {!authUser && (
        <>

            <button
                onClick={() => navigate("/login")}
                className="font-medium text-gray-700 hover:text-blue-600"
            >
                Login
            </button>

            <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white
                           px-5 py-2 rounded-lg
                           font-medium
                           hover:bg-blue-700
                           transition"
            >
                Signup
            </button>

        </>
    )}


    {/* Logged IN */}
    {authUser && (
        <>

            {/* My Orders */}
            <button
                onClick={() => navigate("/orders")}
                className="border border-blue-600
                           text-blue-600
                           px-5 py-2 rounded-lg
                           font-medium
                           hover:bg-blue-600
                           hover:text-white
                           transition
                           cursor-pointer"
            >
                My Orders
            </button>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white
                           px-5 py-2 rounded-lg
                           font-medium
                           hover:bg-red-600
                           transition
                           cursor-pointer"
            >
                Logout
            </button>

        </>
    )}

</div>

            </div>

        </nav>
    );
}

export default Navbar; 