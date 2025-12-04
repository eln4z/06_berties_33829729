# Bertie’s Books

A full-stack Node.js web application built for the Dynamic Web Applications module.
Users can register, log in, search and add books, and retrieve book data through a REST API.
Data is stored in a MySQL/MariaDB database.


## Features

### Users

* Register and log in
* Passwords stored securely using bcrypt
* Sessions stored using express-session
* Protected pages require login
* Login attempts recorded in an audit log
* Logout functionality

### Books

* View a full list of books
* Add a new book with validation and sanitization
* Search for books by title (partial match)
* View bargain books under £20
* All data stored in a MySQL database

### API (JSON)

The application provides JSON data through REST API endpoints:

* `/api/books`
  Returns a JSON list of all books.

* `/api/books?search=world`
  Returns books whose titles contain the word “world”.

* `/api/books?minprice=5&maxprice=15`
  Returns books within a price range.

* `/api/books?sort=name`
  Returns books sorted by title (alphabetically).

* `/api/books?sort=price`
  Returns books sorted by price (lowest first).


## Technologies Used

* Node.js and Express
* MySQL/MariaDB using mysql2
* EJS templates
* express-session
* bcrypt
* express-validator
* express-sanitizer
* dotenv


## Running Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a `.env` File in the Project Root

```
DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=qwertyuiop
DB_NAME=berties_books
DB_CONNECTION_LIMIT=10
SESSION_SECRET=changeme
PORT=8000
```

Note: `.env` is not tracked in Git for security.

### 3. Set Up the Database

```bash
mysql -u berties_books_app -p berties_books < create_db.sql
mysql -u berties_books_app -p berties_books < insert_test_data.sql
```

### 4. Start the Server

```bash
node index.js
```

Open in a browser:

```
http://localhost:8000
```

---

## Running on Goldsmiths VM

### Start the Application in the Background

```bash
nohup node index.js > out.log 2>&1 &
```

### Check if Node is Running

```bash
ps aux | grep node
```

### Stop Node

```bash
pkill node
```

### VM Public URL Format

```
https://www.doc.gold.ac.uk/usr/<your_user_number>/
```

Example:

```
https://www.doc.gold.ac.uk/usr/454/
```

## What I Learned

* Building Express applications
* Rendering dynamic pages using EJS
* Validating and sanitizing form data
* Hashing passwords and using sessions
* Restricting access to protected pages
* Building REST API endpoints
* Deploying Node.js apps to a Linux VM
* Managing MySQL users and permissions
