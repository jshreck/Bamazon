DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(250) NOT NULL,
  department_name VARCHAR(250),
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INT,
  product_sales DECIMAL (10,2) DEFAULT 0
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("whimsical throw pillow", "home", 100.00, 65000),
("snuggie", "home", 20.00, 45),
("unicorn party hat", "party supplies", 2.50, 100),
("mystery box", "miscellaneous", 10.00, 10),
("puppy", "miscellaneous", 500.00, 10),
("rubik's cube", "games", 10.00, 100),
("salt lamp", "home", 20.00, 60),
("pet rock", "miscellaneous", 5.00, 100),
("bouncy castle", "games", 250.00, 12),
("disco ball", "party supplies", 50.00, 250);

CREATE TABLE departments (
  department_id INT(4) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(250) NOT NULL,
  over_head_costs DECIMAL (10,2) NOT NULL
);

INSERT INTO departments (department_name, over_head_costs)
VALUES 
("home", 1000),
("party supplies", 200),
("miscellaneous", 1000),
("games", 200);