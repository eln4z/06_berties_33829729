const express = require("express");
const router = express.Router();
const booksRouter = require("./books");
const usersRouter = require("./users");
router.get("/", function (req, res, next) {
  res.render("index.ejs", {
    shopData: req.app.locals.shopData
  });
});

router.get("/about", function (req, res, next) {
  res.render("about.ejs", {
    shopData: req.app.locals.shopData
  });
});

router.use("/books", booksRouter);

router.use("/users", usersRouter);

module.exports = router;
