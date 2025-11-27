// routes/books.js

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const db = global.db;

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};

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

router.get("/addbook", redirectLogin, function (req, res, next) {
  res.render("addbook.ejs", {
    shopData: req.app.locals.shopData,
    errors: [],
    name: "",
    price: ""
  });
});

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

      res.redirect("/books/list");
    });
  }
);
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

router.get("/search", function (req, res, next) {
  res.render("search.ejs", {
    shopData: req.app.locals.shopData
  });
});

router.get("/search-result", function (req, res, next) {
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

module.exports = router;
