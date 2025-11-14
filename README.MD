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

   http://localhost:8001/
 


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
