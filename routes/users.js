const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { check, validationResult } = require("express-validator");

const db = global.db;

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};

router.get("/register", function (req, res, next) {
  res.render("register.ejs", {
    shopData: req.app.locals.shopData,
    errors: [],
    username: "",
    first: "",
    last: "",
    email: ""
  });
});

router.post(
  "/registered",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address."),
    check("username")
      .isLength({ min: 5, max: 20 })
      .withMessage("Username must be between 5 and 20 characters."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
    check("first")
      .notEmpty()
      .withMessage("First name is required."),
    check("last")
      .notEmpty()
      .withMessage("Last name is required.")
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    const username = req.sanitize(req.body.username);
    const first = req.sanitize(req.body.first);
    const last = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const plainPassword = req.body.password;

    if (!errors.isEmpty()) {
      return res.render("register.ejs", {
        shopData: req.app.locals.shopData,
        errors: errors.array(),
        username,
        first,
        last,
        email
      });
    }

    const checkSql = "SELECT id FROM users WHERE username = ?";
    db.query(checkSql, [username], (err, rows) => {
      if (err) {
        console.error("Error checking existing user:", err);
        return next(err);
      }

      if (rows.length > 0) {
        return res.render("register.ejs", {
          shopData: req.app.locals.shopData,
          errors: [{ msg: "Username already exists. Please choose another." }],
          username,
          first,
          last,
          email
        });
      }

      bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).send("Error hashing password");
        }

        const sql = `
          INSERT INTO users (username, first_name, last_name, email, hashedPassword)
          VALUES (?, ?, ?, ?, ?)
        `;
        const params = [username, first, last, email, hashedPassword];

        db.query(sql, params, function (err, result) {
          if (err) {
            console.error("Error inserting user:", err);
            return res
              .status(500)
              .send("Error saving user to database: " + err.message);
          }

          res.redirect("/users/login");
        });
      });
    });
  }
);

router.get("/list", redirectLogin, function (req, res, next) {
  const sql = "SELECT username, first_name, last_name, email FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return next(err);
    }

    res.render("users_list.ejs", {
      users: results,
      shopData: req.app.locals.shopData
    });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login.ejs", {
    shopData: req.app.locals.shopData
  });
});

router.post("/loggedin", function (req, res, next) {
  const username = req.sanitize(req.body.username);
  const plainPassword = req.body.password;

  if (!username || !plainPassword) {
    return res.send("Please enter both username and password.");
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return next(err);
    }

    if (results.length === 0) {
      const auditSql =
        "INSERT INTO audit_log (username, success, message) VALUES (?, ?, ?)";
      db.query(auditSql, [username, 0, "user not found"]);
      return res.send("Login failed: user not found.");
    }

    const user = results[0];
    const hashedPassword = user.hashedPassword;

    bcrypt.compare(plainPassword, hashedPassword, function (err, match) {
      if (err) {
        console.error("Error comparing passwords:", err);
        return next(err);
      }

      if (match === true) {
        const auditSql =
          "INSERT INTO audit_log (username, success, message) VALUES (?, ?, ?)";
        db.query(auditSql, [username, 1, "login ok"]);

        req.session.userId = user.id;
        req.session.username = user.username;
        return res.redirect("/books/list");
      }

      const auditSql =
        "INSERT INTO audit_log (username, success, message) VALUES (?, ?, ?)";
      db.query(auditSql, [username, 0, "incorrect password"]);

      return res.send("Login failed: incorrect password.");
    });
  });
});

router.get("/audit", redirectLogin, function (req, res, next) {
  const sql = "SELECT * FROM audit_log ORDER BY time DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching audit log:", err);
      return next(err);
    }

    res.render("audit.ejs", {
      logs: results,
      shopData: req.app.locals.shopData
    });
  });
});

router.get("/logout", redirectLogin, function (req, res, next) {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.send("You are now logged out. <a href='/'>Home</a>");
  });
});

module.exports = router;
