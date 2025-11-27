const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();

const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_secret";

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(expressSanitizer());

app.use(express.static(path.join(__dirname, 'public')));

app.locals.shopData = { shopName: "Bertie's Books" };

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000
  }
}));

app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: 0
});

global.db = db;

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
