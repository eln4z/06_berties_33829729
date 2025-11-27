# Bertie’s Books

A small Node.js web application built for the **Dynamic Web Applications** module.
Users can create accounts, log in, and manage a list of books stored in a MySQL database.

---

## Features

### Users

* Register an account
* Log in and log out
* Passwords stored securely (bcrypt)
* Protected pages require login
* Login attempts logged (audit log)

### Books

* View all books
* Add a new book
* Search by name
* Bargain books (price < £20)
* Server-side form validation

---

## Technologies

* Node.js + Express
* MySQL (mysql2)
* EJS templates
* express-session
* bcrypt
* express-validator
* dotenv

---

# Run the App (Local)

### 1. Install packages
npm install

### 2. Create a `.env` file
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=berties_books
DB_CONNECTION_LIMIT=10
SESSION_SECRET=mysecret

> `.env` is in `.gitignore` and not pushed to GitHub.

### 3. Database setup

```sql
CREATE DATABASE berties_books;
USE berties_books;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  hashedPassword VARCHAR(255)
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2)
);

CREATE TABLE audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  success TINYINT(1),
  message VARCHAR(255),
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


### 4. Start the server


node index.js


Then open:


http://localhost:8000


# Running With Forever (on VM)

Start:


forever start index.js


Check running apps:


forever list


Stop:

forever stop index.js


Stop all:


forever stopall

## What I Learned

* Creating routes with Express
* Using EJS templates
* Handling forms and validation
* Connecting Node.js to MySQL
* Password hashing and sessions
* Protecting pages with middleware