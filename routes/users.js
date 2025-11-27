const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = global.db;


const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};


router.get("/register", function (req, res, next) {
  res.render("register.ejs", {
    shopData: req.app.locals.shopData
  });
});


router.post("/registered", function (req, res, next) {
  const username = req.body.username;
  const first = req.body.first;
  const last = req.body.last;
  const email = req.body.email;
  const plainPassword = req.body.password;

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

      let response = `
        Hello ${first} ${last}, you are now registered!<br>
        We will send an email to you at ${email}.<br><br>
        Your password is: ${plainPassword}<br>
        Your hashed password is: ${hashedPassword}
      `;

      res.send(response);
    });
  });
});


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
  const username = req.body.username;
  const plainPassword = req.body.password;

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

        return res.send(
          "Login successful! Welcome back, " +
            user.first_name +
            " " +
            user.last_name +
            "."
        );
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


module.exports = router;
