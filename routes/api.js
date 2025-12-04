// routes/api.js

const express = require("express");
const router = express.Router();

// GET /api/books — with optional search, price range, and sort
router.get('/books', function (req, res, next) {
    // Read query parameters
    const search   = req.query.search   || null;    // e.g. ?search=world
    const minprice = req.query.minprice || null;    // e.g. ?minprice=5
    const maxprice = req.query.maxprice || req.query.max_price || null; // allow both names
    const sort     = req.query.sort     || null;    // e.g. ?sort=name or ?sort=price

    // Base query + params array
    let sqlquery = "SELECT * FROM books";
    const params = [];

    // WHERE conditions
    const conditions = [];

    if (search) {
        conditions.push("name LIKE ?");
        params.push('%' + search + '%');
    }

    if (minprice) {
        conditions.push("price >= ?");
        params.push(Number(minprice));
    }

    if (maxprice) {
        conditions.push("price <= ?");
        params.push(Number(maxprice));
    }

    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // ORDER BY
    if (sort === 'name') {
        sqlquery += " ORDER BY name";
    } else if (sort === 'price') {
        sqlquery += " ORDER BY price";
    }

    // Execute the SQL query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error", details: err });
        } else {
            return res.json(result);
        }
    });
});

module.exports = router;
