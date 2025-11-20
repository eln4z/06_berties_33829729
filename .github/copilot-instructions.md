// Import express, ejs, path, mysql2
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');

// Create the express application object
const app = express();
// Allow PORT from env (useful for some deployments), default to 8000
const port = process.env.PORT || 8000;

// Tell Express we want to use EJS as the view engine
app.set('view engine', 'ejs');

// Set up body parser
app.use(express.urlencoded({ extended: true }));

// Set up the public folder (CSS, static JS)
app.use(express.static(path.join(__dirname, 'public')));

// Application-wide shared data
app.locals.shopData = { shopName: "Bertie's Books" };

// -------------------------
// DATABASE CONNECTION POOL
// -------------------------
const db = mysql.createPool({
  host: 'localhost',
  user: 'berties_books_app',
  password: 'qwertyuiop',
  database: 'berties_books',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make the db pool available everywhere
global.db = db;

// -------------------------
// ROUTES
// -------------------------
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);
// (main.js itself mounts /books and /users, so we don't repeat them here)

// -------------------------
// START SERVER
// -------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
