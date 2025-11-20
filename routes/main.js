// routes/main.js
const express = require("express");
const router = express.Router();

// Load sub-routers
const booksRouter = require("./books");
const usersRouter = require("./users");

// Home page
router.get("/", function (req, res, next) {
  res.render("index.ejs", {
    shopData: req.app.locals.shopData
  });
});

// About page
router.get("/about", function (req, res, next) {
  res.render("about.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Mount /books routes
router.use("/books", booksRouter);

// Mount /users routes
router.use("/users", usersRouter);

// Export the router object so index.js can access it
module.exports = router;
