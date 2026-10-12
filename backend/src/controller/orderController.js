import { db } from "../config/dbconnection.js";

export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const result = await db.query(`
            SELECT
                ci.cart_item_id,
                ci.seller_product_id AS sellerproduct_id,
                ci.quantity AS needed_quantity,
                p.product_id,
                p.product_name,
                p.product_brand,
                p.product_category,
                p.product_sub_category,
                sp.price_per_unit
            FROM cartitems ci
            JOIN sellerproduct sp
                ON ci.seller_product_id = sp.sellerproduct_id
            JOIN product p
                ON sp.product_id = p.product_id
            WHERE ci.user_id = $1
            ORDER BY ci.created_at DESC
        `, [userId]);

        res.status(200).json({ allCartItems: result.rows });
    } catch (error) {
        console.error("getCartItems:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { sellerproduct_id, quantity = 1 } = req.body;

        if (!sellerproduct_id || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Valid product ID and quantity are required"
            });
        }

        const product = await db.query(`
            SELECT sellerproduct_id, available_quantity
            FROM sellerproduct
            WHERE sellerproduct_id = $1
        `, [sellerproduct_id]);

        if (!product.rows.length) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.rows[0].available_quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        await db.query(`
            INSERT INTO cartitems (user_id, seller_product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, seller_product_id)
            DO UPDATE SET quantity =
                cartitems.quantity + EXCLUDED.quantity
        `, [userId, sellerproduct_id, quantity]);

        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error("addToCart:", error);
        res.status(500).json({ message: "Failed to update cart" });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { sellerproduct_id } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const result = await db.query(`
            UPDATE cartitems ci
            SET quantity = $1
            FROM sellerproduct sp
            WHERE ci.user_id = $2
              AND ci.seller_product_id = $3
              AND sp.sellerproduct_id = ci.seller_product_id
              AND sp.available_quantity >= $1
            RETURNING ci.cart_item_id, ci.quantity
        `, [quantity, userId, sellerproduct_id]);

        if (!result.rowCount) {
            return res.status(400).json({
                message: "Cart item not found or insufficient stock"
            });
        }

        res.status(200).json({
            message: "Cart quantity updated",
            quantity: result.rows[0].quantity
        });
    } catch (error) {
        console.error("updateCartQuantity:", error);
        res.status(500).json({
            message: "Failed to update cart quantity"
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { sellerproduct_id } = req.params;

        const result = await db.query(`
            DELETE FROM cartitems
            WHERE user_id = $1 AND seller_product_id = $2
            RETURNING cart_item_id
        `, [userId, sellerproduct_id]);

        if (!result.rowCount) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            message: "Item removed from cart"
        });
    } catch (error) {
        console.error("removeCartItem:", error);
        res.status(500).json({
            message: "Failed to remove cart item"
        });
    }
};

export const getTotal = async (req, res) => {
    try {
        const { cartItems } = req.body;
        console.log("cartItems:", cartItems);
        console.log("is array:", Array.isArray(cartItems));
        let subtotal = 0;
        const calculatedItems = [];
        //find products
        for (const item of cartItems) {
            const result = await db.query(
                `
                SELECT
                p.product_name,
                sp.sellerproduct_id,
                sp.product_id,
                sp.price_per_unit,
                sp. available_quantity
                FROM sellerproduct sp
                join product p
                on sp.product_id = p.product_id
                WHERE sp.sellerproduct_id = $1
                AND p.product_id = $2;
                `, [item.sellerproduct_id, item.product_id]
            );

            const product = result.rows[0];
            if (!product) {
                return res.status(400).json({ message: "Product not found" });
            }
            if (product.available_quantity < item.needed_quantity) {
                return res.status(400).json({ message: `${product.product_name} is out of stock` });
            }

            const itemTotal = Number(product.price_per_unit) * Number(item.needed_quantity);
            subtotal += itemTotal;

            calculatedItems.push({
                sellerproduct_id: product.sellerproduct_id,
                product_id: product.product_id,
                product_name: product.product_name,
                needed_quantity: item.needed_quantity
            });
        }
        console.log(subtotal);
        // 3. DISCOUNT
        // You can replace this with your actual discount logic.
        const discount = 0;

        // 4. DELIVERY CHARGE
        const deliveryCharge = subtotal >= 500 ? 0 : 50;

        // 5. FINAL TOTAL
        const total = subtotal - discount + deliveryCharge;
        res.status(200).json({
            calculatedItems,//This array stores product which user want to order
            subtotal,
            discount,
            deliveryCharge,
            total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get checkout details"
        });
    }

};

export const createOrder = async (req, res) => {
    const client = await db.connect();

    try {

        const userId = req.user.user_id;

        const {
            address,
            paymentMethod,
            calculatedItems,
            frontendTotal
        } = req.body;

        // 1. VALIDATION

        if (!address) {
            return res.status(400).json({
                message: "Address is required"
            });
        }

        if (
            !address.name ||
            !address.address ||
            !address.mobile
        ) {
            return res.status(400).json({
                message: "Complete address is required"
            });
        }

        if (paymentMethod !== "Cash on Delivery") {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        if (
            !Array.isArray(calculatedItems) ||
            calculatedItems.length === 0
        ) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        console.log(
            "Calculated Items:",
            calculatedItems
        );

        console.log(
            "Frontend Total:",
            frontendTotal
        );

        console.log(
            "User ID:",
            userId
        );

        // 2. START TRANSACTION

        await client.query("BEGIN");

        // 3. GET PRODUCTS AND CALCULATE SUBTOTAL

        let subtotal = 0;

        const products = [];

        for (const item of calculatedItems) {

            const result = await client.query(
                `
                SELECT
                    sellerproduct_id,
                    product_id,
                    price_per_unit,
                    available_quantity
                FROM sellerproduct
                WHERE sellerproduct_id = $1
                AND product_id = $2
                `,
                [
                    item.sellerproduct_id,
                    item.product_id
                ]
            );

            const product = result.rows[0];

            // PRODUCT DOES NOT EXIST

            if (!product) {
                throw new Error("Product not found");
            }

            // CHECK STOCK

            if (
                Number(product.available_quantity) <
                Number(item.needed_quantity)
            ) {
                throw new Error(
                    `${item.product_name} is out of stock`
                );
            }

            // CALCULATE ITEM TOTAL

            const itemTotal =
                Number(product.price_per_unit) *
                Number(item.needed_quantity);

            subtotal += itemTotal;

            // STORE VERIFIED PRODUCT INFORMATION

            products.push({
                sellerproduct_id:
                    product.sellerproduct_id,

                product_id:
                    product.product_id,

                price_per_unit:
                    Number(product.price_per_unit),

                needed_quantity:
                    Number(item.needed_quantity)
            });
        }

        // 4. DISCOUNT

        const discount = 0;

        // 5. DELIVERY CHARGE

        const deliveryCharge =
            subtotal >= 500
                ? 0
                : 50;

        // 6. FINAL TOTAL

        const totalAmount =
            subtotal -
            discount +
            deliveryCharge;

        console.log(
            "Backend Subtotal:",
            subtotal
        );

        console.log(
            "Backend Delivery:",
            deliveryCharge
        );

        console.log(
            "Backend Total:",
            totalAmount
        );

        // 7. CHECK FRONTEND TOTAL

        if (
            frontendTotal !== undefined &&
            Number(frontendTotal) !== Number(totalAmount)
        ) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "Cart has changed. Please review your order.",
                totalAmount
            });
        }

        // 8. CREATE ORDER

        const orderResult = await client.query(
            `
            INSERT INTO orders
            (
                user_id,
                order_date,
                sub_total,
                discount,
                delivery_fee,
                total_amount_payable,
                shipping_name,
                shipping_address,
                shipping_mobile
            )
            VALUES
            (
                $1,
                NOW(),
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            RETURNING order_id
            `,
            [
                userId,
                subtotal,
                discount,
                deliveryCharge,
                totalAmount,
                address.name,
                address.address,
                address.mobile
            ]
        );

        const orderId =
            orderResult.rows[0].order_id;

        console.log(
            "Order ID:",
            orderId
        );

        // 9. CREATE ORDER ITEMS + REDUCE STOCK

        for (const product of products) {

            const totalPrice =
                product.needed_quantity *
                product.price_per_unit;

            // CREATE ORDER ITEM

            await client.query(
                `
                INSERT INTO orderitems
                (
                    order_id,
                    sellerproduct_id,
                    quantity,
                    unit_price,
                    price,
                    status
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                `,
                [
                    orderId,
                    product.sellerproduct_id,
                    product.needed_quantity,
                    product.price_per_unit,
                    totalPrice,
                    "CONFIRMED"
                ]
            );

            // REDUCE STOCK

            await client.query(
                `
                UPDATE sellerproduct
                SET available_quantity =
                    available_quantity - $1
                WHERE sellerproduct_id = $2
                `,
                [
                    product.needed_quantity,
                    product.sellerproduct_id
                ]
            );
        }

        // 10. CREATE PAYMENT

        await client.query(
            `
            INSERT INTO payment
            (
                order_id,
                payment_method,
                amount,
                payment_time,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                NOW(),
                $4
            )
            `,
            [
                orderId,
                paymentMethod,
                totalAmount,
                "pending"
            ]
        );

        // 11. COMMIT TRANSACTION

        await client.query("COMMIT");

        // 12. RESPONSE

        res.status(201).json({
            message:
                "Order placed successfully",

            orderId,

            subtotal,

            discount,

            deliveryCharge,

            totalAmount,

            paymentMethod
        });

    } catch (error) {

        // ROLLBACK

        await client.query("ROLLBACK");

        console.error(
            "Error in createOrder controller:",
            error
        );

        res.status(500).json({
            message:
                error.message ||
                "Failed to place order"
        });

    } finally {

        // RETURN CLIENT TO POOL

        client.release();
    }
};

export const myOrders = async (req, res) => {
    try {
        const loggedUserId = req.user.user_id;
        const result = await db.query(
            `
    SELECT
        o.order_id,
        o.user_id,
        o.order_date,
        o.total_amount_payable,
        o.shipping_name,
        o.shipping_address,
        COUNT(oi.orderitems_id) AS no_of_items,
        p.status
    FROM orders o
    JOIN orderitems oi
        ON o.order_id = oi.order_id
    LEFT JOIN payment p
        ON o.order_id = p.order_id
    WHERE o.user_id = $1
    GROUP BY
        o.order_id,
        o.user_id,
        o.order_date,
        o.total_amount_payable,
        o.shipping_name,
        o.shipping_address,
        p.status
    ORDER BY o.order_date DESC
    `,
            [loggedUserId]
        );
        res.status(201).json({
            message: "Order fetched succesfully",
            orders: result.rows //returns an array
        })
    } catch (error) {
        console.log("error in Order controller.", error);
        res.status(400).json({ message: "Internal server Error" });
    }
}

export const getOrderById = async (req, res) => {
    try {

        const userId = req.user.user_id;
        const { orderid } = req.params;

        console.log(
            "orderid:",
            orderid,
            "userid:",
            userId
        );

        // 1. Get order + price + payment details
        const orderResult = await db.query(
            `
            SELECT 
                o.order_id,
                o.shipping_name,
                o.shipping_address,
                o.shipping_mobile,
                o.order_date,

                o.sub_total,
                o.discount,
                o.delivery_fee,
                o.total_amount_payable,

                pay.payment_method,
                pay.amount AS payment_amount,
                pay.payment_time,
                pay.status AS payment_status

            FROM orders o

            LEFT JOIN payment pay
                ON o.order_id = pay.order_id

            WHERE o.order_id = $1
            AND o.user_id = $2
            `,
            [orderid, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // 2. Get all items of this order
        const itemsResult = await db.query(
            `
            SELECT 
                oi.sellerproduct_id,
                oi.quantity,
                oi.unit_price,
                oi.price,
                oi.status AS item_status,

                p.product_name,
                p.product_brand

            FROM orderitems oi

            JOIN sellerproduct sp
                ON oi.sellerproduct_id = sp.sellerproduct_id

            JOIN product p
                ON sp.product_id = p.product_id

            WHERE oi.order_id = $1
            `,
            [orderid]
        );

        // 3. Combine everything
        const order = {
            ...orderResult.rows[0],
            items: itemsResult.rows
        };

        res.status(200).json({
            order
        });

    } catch (error) {

        console.log(
            "error in getOrderById controller",
            error
        );

        res.status(500).json({
            message: "Internal server error"
        });
    }
};