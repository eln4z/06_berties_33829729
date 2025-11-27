const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = global.db;

// Middleware to require login
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};

// Register form
router.get("/register", function (req, res, next) {
  res.render("register.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Handle registration
router.post("/registered", function (req, res, next) {
  const username = req.body.username;
  const first = req.body.first;
  const last = req.body.last;
  const email = req.body.email;
  const plainPassword = req.body.password;

  // Basic validation
  if (!username || !first || !last || !email || !plainPassword) {
    return res.send("All fields (username, first name, last name, email, password) are required.");
  }

  // Check if username already exists
  const checkSql = "SELECT id FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, rows) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return next(err);
    }

    if (rows.length > 0) {
      return res.send("Username already exists. Please choose another username.");
    }

    // Username is free – hash password and insert
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

        // Do NOT send plain or hashed password back to the browser
        // Redirect to login page after successful registration
        res.redirect("/users/login");
      });
    });
  });
});

// List users (protected)
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

// Login form
router.get("/login", function (req, res, next) {
  res.render("login.ejs", {
    shopData: req.app.locals.shopData
  });
});

// Handle login
router.post("/loggedin", function (req, res, next) {
  const username = req.body.username;
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

        // Save user session (user is now logged in)
        req.session.userId = user.id;
        req.session.username = user.username;

        // Redirect to a protected page after successful login
        return res.redirect("/books/list"); // change if you prefer another page
      }

      const auditSql =
        "INSERT INTO audit_log (username, success, message) VALUES (?, ?, ?)";
      db.query(auditSql, [username, 0, "incorrect password"]);

      return res.send("Login failed: incorrect password.");
    });
  });
});

// Audit log (protected)
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

// Logout (protected)
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
