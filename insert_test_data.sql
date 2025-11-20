# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES 
(
  'gold',
  'Gold',
  'User',
  'gold@example.com',
  '$2b$10$CNRnV28eswelsYoDtw9V3ukd2pi1W5w5zNMoAytNHY3UvS1T8Uj.e'
);

