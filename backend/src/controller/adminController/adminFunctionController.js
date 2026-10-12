import { db } from "../../config/dbconnection.js";

export const addProductDetails = async (req, res) => {
    try {
        const {
            product_name,
            product_category,
            product_sub_category,
            product_brand,
            product_description
        } = req.body;

        await db.query(
            `INSERT INTO product 
            (product_name, product_category, product_sub_category, product_brand, product_description) 
            VALUES ($1, $2, $3, $4, $5)`,
            [
                product_name,
                product_category,
                product_sub_category,
                product_brand,
                product_description
            ]
        );

        res.status(201).json({
            message: "Product added successfully"
        });

    } catch (error) {
        console.log("error in addProductDetails controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const allProducts = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM product"
        );

        res.status(200).json({
            message: "All products fetched successfully",
            products: result.rows
        });

    } catch (error) {
        console.log("error in allProducts controller", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const allSellerProducts = async (req, res) => {
    try {
        const result = await db.query(`
    SELECT
        sp.sellerproduct_id,
        sp.seller_id,
        s.seller_name ,
        sp.product_id,
        p.product_name,
        sp.available_quantity,
        sp.price_per_unit
    FROM sellerproduct sp
    JOIN seller s
        ON sp.seller_id = s.seller_id
    JOIN product p
        ON sp.product_id = p.product_id
`);

        res.status(200).json({
            message: "All seller products fetched successfully",
            sellerProducts: result.rows
        });

    } catch (error) {
        console.log("error in allSellerProducts controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const allOrder = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                u.user_name ,
                u.user_email,
                o.order_id ,
                o.order_date,
                o.sub_total,
                o.discount,
                o.delivery_fee,
                o.total_amount_payable,
                o.shipping_name,
                o.shipping_address,
                o.shipping_mobile
            FROM orders o
            JOIN users u
                ON o.user_id = u.user_id
            ORDER BY o.order_date DESC
        `)
        res.status(201).json({
            message: "Order fetched succesfully",
            orders: result.rows //returns an array
        })
    } catch (error) {
        console.log("error in allorder controlller", error)
        res.status(500).json({ message: "Internal server Error" })
    }
};

export const adminGetOrderById = async (req, res) => {
    try {

        const { orderid } = req.params;

        // 1. Get order + user details
        const orderResult = await db.query(
            `
            SELECT
                u.user_name,
                u.user_email,

                o.order_id,
                o.order_date,
                o.sub_total,
                o.discount,
                o.delivery_fee,

                o.shipping_name,
                o.shipping_address,
                o.shipping_mobile,

                o.total_amount_payable,
                p.payment_method

            FROM orders o

            JOIN users u
                ON o.user_id = u.user_id
            join payment p
              on p.order_id = o.order_id

            WHERE o.order_id = $1
            `,
            [orderid]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // 2. Get order items + seller details
        const itemsResult = await db.query(
            `
            SELECT
                oi.sellerproduct_id,
                oi.quantity,
                oi.unit_price,
                oi.price,
                oi.status AS item_status,
                
                p.product_name,
                p.product_brand,

                s.seller_name,
                s.seller_email,
                s.seller_location,
                s.seller_city

            FROM orderitems oi

            JOIN sellerproduct sp
                ON oi.sellerproduct_id = sp.sellerproduct_id

            JOIN product p
                ON sp.product_id = p.product_id

            JOIN seller s
                ON sp.seller_id = s.seller_id

            WHERE oi.order_id = $1
            `,
            [orderid]
        );

        // 3. Combine order + items
        const order = {
            ...orderResult.rows[0],
            items: itemsResult.rows
        };

        res.status(200).json({
            order
        });

    } catch (error) {

        console.log("error in adminGetOrderById controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const allUser = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM users"
        );

        res.status(200).json({
            message: "All users fetched successfully",
            users: result.rows
        });

    } catch (error) {
        console.log("error in allUser controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const allSeller = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM seller"
        );

        res.status(200).json({
            message: "All sellers fetched successfully",
            sellers: result.rows
        });

    } catch (error) {
        console.log("error in allSeller controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSellerById = async (req, res) => {
    try {

        const { sellerId } = req.params;

        const result = await db.query(
            `SELECT
                seller_id,
                seller_name,
                seller_contact,
                seller_email,
                seller_location,
                seller_city,
                seller_registration_date,
                seller_status,
                rejection_reason
             FROM seller
             WHERE seller_id = $1`,
            [sellerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        return res.status(200).json({
            seller: result.rows[0]
        });

    } catch (error) {

        console.error("Get seller details error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

/* Approve / Reject seller */
export const updateSellerStatus = async (req, res) => {
    try {

        const { sellerId } = req.params;
        const { seller_status, rejection_reason } = req.body;

        /* Validate status */
        if (!["approved", "rejected"].includes(seller_status)) {
            return res.status(400).json({
                message: "Invalid seller status"
            });
        }

        /* Reason required for both approve and reject */
        if (!rejection_reason?.trim()) {
            return res.status(400).json({
                message: "Reason is required"
            });
        }

        const result = await db.query(
            `UPDATE seller
             SET
                seller_status = $1,
                rejection_reason = $2
             WHERE seller_id = $3
             RETURNING
                seller_id,
                seller_name,
                seller_email,
                seller_status,
                rejection_reason`,
            [
                seller_status,
                rejection_reason.trim(),
                sellerId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        return res.status(200).json({
            message:
                seller_status === "approved"
                    ? "Seller approved successfully"
                    : "Seller rejected successfully",
            seller: result.rows[0]
        });

    } catch (error) {

        console.error("Update seller status error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const dashboard = async (req, res) => {
    try {
        const productResult = await db.query(
            `SELECT COUNT(*) FROM product`
        );

        const sellerProductResult = await db.query(
            `SELECT COUNT(*) FROM sellerproduct`
        );

        const orderResult = await db.query(
            `SELECT COUNT(*) FROM orders`
        );

        const userResult = await db.query(
            `SELECT COUNT(*) FROM users`
        );

        const sellerResult = await db.query(
            `SELECT COUNT(*) FROM seller`
        );

        res.status(200).json({
            products: Number(productResult.rows[0].count),
            sellerProducts: Number(sellerProductResult.rows[0].count),
            orders: Number(orderResult.rows[0].count),
            users: Number(userResult.rows[0].count),
            sellers: Number(sellerResult.rows[0].count)
        });

    } catch (error) {
        console.log("Error in dashboard controller:", error);

        res.status(500).json({
            message: "Failed to fetch dashboard data"
        });
    }
};