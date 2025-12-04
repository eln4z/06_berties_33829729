// routes/api.js

const express = require("express");
const router = express.Router();

router.get('/books', function (req, res, next) {

    let sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error(err);
            return next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
