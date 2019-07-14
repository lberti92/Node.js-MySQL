DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (101, "Jump Ropes", "Sproting Goods", 5.99, 100),
(102, "Medicine Ball", "Sporting Goods", 50.00, 15),
(201, "Blender Bottle", "Home & Kitchen", 8.49, 25),
(202, "Meal Prep Containers", "Home & Kitchen", 11.99, 25),
(103, "Nike Duffel Bag", "Sporting Goods", 30.00, 20),
(301, "Women's Ponytail Baseball Cap", "Clothing & Accessories", 13.99, 10),
(302, "Women's Boho Headbank - 4 pk", "Clothing & Accessories", 9.87, 10),
(104, "Ab Mat", "Sporting Goods", 15.99, 10),
(401, "Aviator Sunglasses", "Sunglasses & Eyewear", 9.99, 20),
(402, "Sport Sunglasses", "Sunglasses & Eyewear", 9.99, 20);

SELECT * FROM products;
