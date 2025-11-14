// Import express and ejs
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');

// Create the express application object
const app = express();
const port = 8001; // your chosen port

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

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

// -------------------------
// START SERVER
// -------------------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
