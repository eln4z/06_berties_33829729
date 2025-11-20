// routes/books.js

const express = require("express");
const router = express.Router();

// Use the global db connection (set in index.js)
const db = global.db;

// List all books
router.get("/list", function (req, res, next) {
  const sqlquery = "SELECT * FROM books";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("list.ejs", {
      availableBooks: result,
      shopData: req.app.locals.shopData
    });
  });
});

// Show add book form
router.get("/addbook", function (req, res, next) {
  res.render("addbook.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Add a book to the database
router.post("/bookadded", function (req, res, next) {
  const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";

  const newrecord = [req.body.name, req.body.price];

  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(
      "This book is added to database: " +
        req.body.name +
        " — £" +
        req.body.price
    );
  });
});

// Bargain books (< £20)
router.get("/bargainbooks", function (req, res, next) {
  const sqlquery = "SELECT * FROM books WHERE price < 20";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("list.ejs", {
      availableBooks: result,
      shopData: req.app.locals.shopData
    });
  });
});

// Search form
router.get("/search", function (req, res, next) {
  res.render("search.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Search results
router.get("/search-result", function (req, res, next) {
  const keyword = req.query.keyword;
  const sqlquery = "SELECT * FROM books WHERE name LIKE ?";

  const searchValue = "%" + keyword + "%";

  db.query(sqlquery, [searchValue], (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("list.ejs", {
      availableBooks: result,
      shopData: req.app.locals.shopData
    });
  });
});

// Export router
module.exports = router;
