// routes/books.js

const express = require("express");
const router = express.Router();


router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) { next(err); }

        res.render("list.ejs", {
            availableBooks: result,
            shopData: req.app.locals.shopData
        });
    });
});


router.post('/bookadded', function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";

    let newrecord = [
        req.body.name,
        req.body.price
    ];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) { next(err); }
        else {
            res.send(
                "This book is added to database: " +
                req.body.name + " — £" + req.body.price
            );
        }
    });
});


router.get('/bargainbooks', function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) { next(err); }

        res.render("list.ejs", {
            availableBooks: result,
            shopData: req.app.locals.shopData
        });
    });
});


router.get('/search', function (req, res, next) {
    res.render('search.ejs', {
        shopData: req.app.locals.shopData
    });
});


router.get('/search-result', function (req, res, next) {
    let keyword = req.query.keyword;
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    let searchValue = '%' + keyword + '%';

    db.query(sqlquery, [searchValue], (err, result) => {
        if (err) { next(err); }

        res.render("list.ejs", {
            availableBooks: result,
            shopData: req.app.locals.shopData
        });
    });
});

// Export router
module.exports = router;
