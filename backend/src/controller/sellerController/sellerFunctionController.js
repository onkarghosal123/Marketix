import { db } from "../../config/dbconnection.js";

export const getAllProduct = async (req, res) => {
    try {
        const loggedSellerId = req.seller.seller_id;

        // Fetch all products
        const result = await db.query("SELECT * FROM product");

        const existingProduct = result.rows;

        if (existingProduct.length === 0) {
            return res.status(400).json({ message: "No Product Yet." });
        }

        // Fetch all products added by this seller
        const sellerProductResult = await db.query(
            `
            SELECT *
            FROM sellerproduct
            WHERE seller_id = $1
            `,
            [loggedSellerId]
        );

        const existingSellerProduct = sellerProductResult.rows;

        res.status(200).json({
            message: "Product fetched successfully",
            products: existingProduct,
            sellerProducts: existingSellerProduct
        });

    } catch (error) {
        console.log("error in getAllProduct controller", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const addPrice = async (req, res) => {
    try {
        const loggedSellerId = req.seller.seller_id
        const { product_id, available_quantity, price_per_unit } = req.body

        const productResult = await db.query("select * from product where product_id = $1", [product_id])
        if (productResult.rows.length === 0) {
            return res.status(400).json({ message: "Product does not exist." })
        }

        //if already exist in sellerproduct table it means alrady added price.
        const sellerProductResult = await db.query(
            `
            select * 
            from sellerproduct 
            where seller_id=$1 and product_id = $2
            `, [loggedSellerId, product_id]
        )
        if (sellerProductResult.rows.length !== 0) {
            return res.status(400).json({ message: "Price and quantity already added." })
        }

        //"insert into sellerproduct (seller_id,product_id,available_quantity,price_per_unit) values ($1,$2,$3,$4,)",[seller_id,product_id,available_quantity,price_per_unit]
        await db.query(
            `INSERT INTO sellerproduct (seller_id, product_id, available_quantity, price_per_unit) 
            VALUES ($1, $2, $3, $4) 
            `, [loggedSellerId, product_id, available_quantity, price_per_unit]);

        res.status(201).json({ message: "Product price added successfully" });
    } catch (error) {
        console.log("error in addprice controller", error);
        res.status(400).json({ message: "Internal server error" });
    }
}

export const getSellerProduct = async (req, res) => {
    try {
        const loggedSellerId = req.seller.seller_id;

        const result = await db.query(
            `SELECT sp.sellerproduct_id,sp.product_id,sp.price_per_unit,sp.available_quantity,p.product_name,p.product_brand ,p.product_category,p.product_sub_category
            FROM sellerproduct sp
            join product p
              on p.product_id = sp.product_id
            WHERE seller_id = $1`,
            [loggedSellerId]
        );

        const existingSellerProduct = result.rows;

        res.status(200).json({
            message: "All seller products fetched successfully",
            sellerProducts: existingSellerProduct
        });

    } catch (error) {
        console.log("error in getSellerProduct controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updatePrice = async (req, res) => {
    try {
        const loggedSellerId = req.seller.seller_id;
        const { product_id, available_quantity, price_per_unit } = req.body;

        // Check whether seller has added this product
        const sellerProductResult = await db.query(
            `
            SELECT *
            FROM sellerproduct
            WHERE seller_id = $1 AND product_id = $2
            `,
            [loggedSellerId, product_id]
        );

        // Product is not added by this seller
        if (sellerProductResult.rows.length === 0) {
            return res.status(400).json({
                message: "Product price has not been added yet."
            });
        }

        // Update price and quantity
        const updatedResult = await db.query(
            `
            UPDATE sellerproduct
            SET available_quantity = $1,
                price_per_unit = $2
            WHERE seller_id = $3
              AND product_id = $4
            RETURNING *
            `,
            [
                available_quantity,
                price_per_unit,
                loggedSellerId,
                product_id
            ]
        );
        const updatedSellerProduct = updatedResult.rows;
        res.status(200).json({
            message: "Product price and quantity updated successfully",
            updatedSellerProduct
        });

    } catch (error) {
        console.log("error in updatePrice controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAllOrderItems = async (req, res) => {
    try {

        const loggedSellerId = req.seller.seller_id;

        const result = await db.query(
            `
            SELECT
                oi.orderitems_id,
                oi.order_id,
                oi.quantity,
                oi.unit_price,
                oi.price,
                oi.status,

                p.product_id,
                p.product_name,
                p.product_brand

            FROM orderitems oi

            JOIN sellerproduct sp
                ON oi.sellerproduct_id = sp.sellerproduct_id

            JOIN product p
                ON p.product_id = sp.product_id

            WHERE sp.seller_id = $1
            `,
            [loggedSellerId]
        );

        res.status(200).json({
            message: "All order items fetched successfully",
            allOrderItems: result.rows
        });

    } catch (error) {

        console.log("error in getAllOrderItems controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateOrderItemStatus = async (req, res) => {
    try {

        const loggedSellerId = req.seller.seller_id;
        const { orderitems_id, status } = req.body;

        const result = await db.query(
            `
            UPDATE orderitems oi
            SET status = $1

            FROM sellerproduct sp

            WHERE oi.orderitems_id = $2
            AND oi.sellerproduct_id = sp.sellerproduct_id
            AND sp.seller_id = $3

            RETURNING
                oi.orderitems_id,
                oi.order_id,
                oi.sellerproduct_id,
                oi.quantity,
                oi.unit_price,
                oi.price,
                oi.status
            `,
            [status, orderitems_id, loggedSellerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Order item not found or does not belong to you"
            });
        }

        res.status(200).json({
            message: "Order item status updated successfully",
            orderItem: result.rows[0]
        });

    } catch (error) {

        console.log("error in updateOrderItemStatus controller", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const sellerDashboard = async (req, res) => {
    try {
        const sellerId = req.seller.seller_id;

        const productsResult = await db.query(`
            SELECT COUNT(*) AS count
            FROM product
        `);

        const myProductsResult = await db.query(`
            SELECT COUNT(*) AS count
            FROM sellerproduct
            WHERE seller_id = $1
        `, [sellerId]);
        const ordersResult = await db.query(`
            SELECT COUNT(*) AS count
            FROM orderitems oi
            JOIN sellerproduct sp
                ON oi.sellerproduct_id = sp.sellerproduct_id
            WHERE sp.seller_id = $1
             
        `, [sellerId]);
        const pendingOrdersResult = await db.query(`
            SELECT COUNT(*) AS count
            FROM orderitems oi
            JOIN sellerproduct sp
                ON oi.sellerproduct_id = sp.sellerproduct_id
            WHERE sp.seller_id = $1
            AND oi.status = 'pending'
        `, [sellerId]);
        const toDeliverOrdersResult = await db.query(`
            SELECT COUNT(*) AS count
            FROM orderitems oi
            JOIN sellerproduct sp
                ON oi.sellerproduct_id = sp.sellerproduct_id
            WHERE sp.seller_id = $1
            AND oi.status IN ('CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY')
        `, [sellerId]);

        res.status(200).json({
            availableProducts: Number(productsResult.rows[0].count),
            myProducts: Number(myProductsResult.rows[0].count),
            totalOrders: Number(ordersResult.rows[0].count),
            pendingOrders: Number(pendingOrdersResult.rows[0].count),
            toDeliverOrders: Number(toDeliverOrdersResult.rows[0].count)
        });

    } catch (error) {
        console.log("Error in sellerDashboard:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateSellerApplication = async (req, res) => {
    try {
        const sellerId = req.seller.seller_id;

        const {
            seller_name,
            seller_contact,
            seller_email,
            seller_city,
            seller_location
        } = req.body;

        if (
            !seller_name ||
            !seller_contact ||
            !seller_email ||
            !seller_city ||
            !seller_location
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check seller exists
        const sellerResult = await db.query(
            `SELECT seller_id, seller_status
             FROM seller
             WHERE seller_id = $1`,
            [sellerId]
        );

        if (sellerResult.rows.length === 0) {
            return res.status(404).json({
                message: "Seller not found"
            });
        }

        const seller = sellerResult.rows[0];

        // Only rejected seller can resubmit
        if (seller.seller_status !== "rejected") {
            return res.status(400).json({
                message: "Only rejected applications can be edited"
            });
        }

        const result = await db.query(
            `UPDATE seller 
     SET 
        seller_name = $1, 
        seller_contact = $2, 
        seller_email = $3, 
        seller_city = $4, 
        seller_location = $5, 
        seller_status = 'pending', 
        rejection_reason = NULL 
     WHERE seller_id = $6 
     RETURNING 
        seller_id,
        seller_name,
        seller_contact,
        seller_email,
        seller_city,
        seller_location,
        seller_status,
        rejection_reason,
        seller_registration_date`,
            [
                seller_name.trim(),
                seller_contact.trim(),
                seller_email.trim(),
                seller_city.trim(),
                seller_location.trim(),
                sellerId
            ]
        );

        return res.status(200).json({
            message: "Application updated successfully and submitted for review",
            seller: result.rows[0]
        });
    } catch (error) {
        console.error("Update seller application error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

