// routes/books.js

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
      shopData: req.app.locals.shopData
    });
  });
});

// Show add book form (protected)
router.get("/addbook", redirectLogin, function (req, res, next) {
  res.render("addbook.ejs", {
    shopData: req.app.locals.shopData,
    errors: [],
    name: "",
    price: ""
  });
});

// Add a book to the database (protected + validated + sanitised)
router.post(
  "/bookadded",
  redirectLogin,
  [
    check("name")
      .notEmpty()
      .withMessage("Book name is required."),
    check("price")
      .isFloat({ min: 1 })
      .withMessage("Price must be a number greater than 0.")
  ],
  function (req, res, next) {

    const errors = validationResult(req);

    // Sanitise inputs to protect against XSS
    const name = req.sanitize(req.body.name);
    const price = req.sanitize(req.body.price);

    if (!errors.isEmpty()) {
      return res.render("addbook.ejs", {
        shopData: req.app.locals.shopData,
        errors: errors.array(),
        name,
        price
      });
    }

    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sqlquery, [name, price], (err, result) => {
      if (err) {
        return next(err);
      }

      // Better UX: redirect instead of plain text
      res.redirect("/books/list");
    });
  }
);

// Bargain books (< £20) (protected)
router.get("/bargainbooks", redirectLogin, function (req, res, next) {
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

// Search form (public)
router.get("/search", function (req, res, next) {
  res.render("search.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Search results (public)
router.get("/search-result", function (req, res, next) {
  // Sanitise search keyword
  const keyword = req.sanitize(req.query.keyword || "");
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
