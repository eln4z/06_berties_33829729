// routes/books.js

const express = require("express");
const router = express.Router();

// Use the global db connection (set in index.js)
const db = global.db;

// Middleware to require login for protected book routes
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};

// List all books (protected)
router.get("/list", redirectLogin, function (req, res, next) {
  const sqlquery = "SELECT * FROM books";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("list.ejs", {
      availableBooks: result,
      shopData: req.app.locals.shopData,
      username: req.session.username
    });
  });
});

// Show add book form (protected)
router.get("/addbook", redirectLogin, function (req, res, next) {
  res.render("addbook.ejs", {
    shopData: req.app.locals.shopData,
    username: req.session.username
  });
});

// Add a book to the database (protected)
router.post("/bookadded", redirectLogin, function (req, res, next) {
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

// Bargain books (< £20) (protected)
router.get("/bargainbooks", redirectLogin, function (req, res, next) {
  const sqlquery = "SELECT * FROM books WHERE price < 20";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("list.ejs", {
      availableBooks: result,
      shopData: req.app.locals.shopData,
      username: req.session.username
    });
  });
});

// Search form (public – add redirectLogin here too if you want it protected)
router.get("/search", function (req, res, next) {
  res.render("search.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Search results (public – add redirectLogin here too if you want it protected)
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
