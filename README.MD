# Bertie’s Books

A small web application built for the **Dynamic Web Applications** module.
The app lets you view books, add new ones, see bargain books, and search the database.


## What the app can do

* Show a full list of books
* Add a new book using a form
* Save books into a MySQL database
* Show bargain books (price under £20)
* Search for books (exact and partial match)
* Render pages using EJS templates



## How to run the app

1. Install the required packages:

   npm install


2. Start the server:

   node index.js

3. Open your browser and go to:

   http://localhost:8000/
 


## Database setup (MySQL)

Create the database:

```sql
CREATE DATABASE berties_books;
USE berties_books;

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2)
);
```

## About this project

This is a learning project to practise:

* Express routes
* EJS templates
* Working with forms
* SQL queries
* Connecting Node.js with MySQL

## dotenv

I used the dotenv module to move my database credentials out of the source code.

- I created a .env file with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT.
- In index.js I call require('dotenv').config() and read these values using process.env.
- The .env file is in .gitignore so the credentials are not pushed to GitHub.
- On the VM I created the same .env file so the app can connect to the MySQL database there.
