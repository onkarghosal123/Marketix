import { db } from "../config/dbconnection.js"

export const allProduct = async (req, res) => {
    try {
        const sql = `
           SELECT
    p.product_id,
    p.product_name,
    p.product_category,
    p.product_sub_category,
    p.product_brand,
    sp.sellerproduct_id,
    sp.price_per_unit AS min_price
FROM product p
JOIN sellerproduct sp
    ON sp.product_id = p.product_id
WHERE sp.available_quantity > 0
  AND sp.price_per_unit = (
      SELECT MIN(sp2.price_per_unit)
      FROM sellerproduct sp2
      WHERE sp2.product_id = p.product_id
        AND sp2.available_quantity > 0
  );
        `;

        const result = await db.query(sql);

        const allProducts = result.rows;

        console.log("all products fetch successfully");

        res.status(201).json({ allProducts });

    } catch (error) {
        console.log("eror in all product controller", error);

        res.status(400).json({
            message: "somthing went wrong !"
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { sellerproductid } = req.params;

        // Get product
        const productResult = await db.query(
            `
            SELECT
                p.product_id,
                p.product_name,
                p.product_brand,
                p.product_category,
                p.product_sub_category,
                p.product_description,
                sp.sellerproduct_id,
                sp.price_per_unit
            FROM sellerproduct sp
            JOIN product p
                ON sp.product_id = p.product_id
            WHERE sp.sellerproduct_id = $1
            `,
            [sellerproductid]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product: productResult.rows[0],
        });

    } catch (error) {
        console.log("error in getProductById controller", error);

        res.status(500).json({
            message: "Something went wrong!"
        });
    }
};
