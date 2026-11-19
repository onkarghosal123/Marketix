import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Payment from "./pages/Payment.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Orders from "./pages/Orders.jsx";
import OrderById from "./pages/OrderById.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

import SellerDashboard from "./pages/SellerDashboard.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";
import SellerRegister from "./pages/SellerRegister.jsx";
import SellerEdit from "./pages/SellerEdit";

import UserProvider from "./contexts/UserContext.jsx";
import SellerProvider, { SellerContext } from "./contexts/SellerContext.jsx";
import AdminProvider, { AdminContext } from "./contexts/AdminContext.jsx";

import { Toaster } from "react-hot-toast";


// =========================
// SELLER LOGIN ROUTE
// =========================

function SellerLoginRoute() {

    const { seller, isSellerLoading } =
        useContext(SellerContext);

    if (isSellerLoading) {
        return <div>Loading...</div>;
    }

    if (seller) {
        return <Navigate to="/seller/dashboard" replace />;
    }

    return <SellerLogin />;
}


// =========================
// SELLER REGISTER ROUTE
// =========================

function SellerRegisterRoute() {

    const { seller, isSellerLoading } =
        useContext(SellerContext);

    if (isSellerLoading) {
        return <div>Loading...</div>;
    }

    if (seller) {
        return <Navigate to="/seller/dashboard" replace />;
    }

    return <SellerRegister />;
}


// =========================
// SELLER DASHBOARD ROUTE
// =========================

function SellerDashboardRoute() {

    const { seller, isSellerLoading } =
        useContext(SellerContext);

    if (isSellerLoading) {
        return <div>Loading...</div>;
    }

    if (!seller) {
        return <Navigate to="/seller/login" replace />;
    }

    return <SellerDashboard />;
}


// =========================
// APP ROUTER
// =========================

function AppRouter() {

    const {
        admin,
        isAdminLoading
    } = useContext(AdminContext);


    const router = createBrowserRouter([

        // =========================
        // USER ROUTES
        // =========================

        {
            path: "/",

            element: <App />,

            children: [

                {
                    path: "/",
                    element: <Home />
                },

                {
                    path: "/login",
                    element: <UserLogin />
                },

                {
                    path: "/signup",
                    element: <UserSignup />
                },

                {
                    path: "/product/:spid",
                    element: <ProductDetails />
                },

                {
                    path: "/cart",
                    element: <Cart />
                },

                {
                    path: "/payment",
                    element: <Payment />
                },

                {
                    path: "/order-success/:orderId",
                    element: <OrderSuccess />
                },

                {
                    path: "/orders",
                    element: <Orders />
                },

                {
                    path: "/orders/:orderid",
                    element: <OrderById />
                }

            ]
        },


        // =========================
        // SELLER ROUTES
        // =========================

        {
            path: "/seller/register",
            element: <SellerRegisterRoute />
        },

        {
            path: "/seller/login",
            element: <SellerLoginRoute />
        },

        {
            path: "/seller/dashboard",
            element: <SellerDashboardRoute />
        },
        {
            path: "/seller/edit",
            element: <SellerEdit />
        },


        // =========================
        // ADMIN ROUTE
        // =========================

        {
            path: "/admin",

            element: isAdminLoading
                ? <div>Loading...</div>
                : admin
                    ? <AdminDashboard />
                    : <AdminLogin />
        }

    ]);


    return <RouterProvider router={router} />;
}


// =========================
// ROOT
// =========================

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <Provider store={store}>

            <AdminProvider>

                <SellerProvider>

                    <UserProvider>

                        <AppRouter />

                    </UserProvider>

                </SellerProvider>

            </AdminProvider>

            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </Provider>

    </StrictMode>
);
//if you put Toaster inside App, seller and admin pages won't have that Toaster.