-- Create Database
CREATE DATABASE IF NOT EXISTS vshine_db;
USE vshine_db;

-- Table for Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Contact Form Messages
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Products
INSERT INTO products (name, brand, price, image, category) VALUES 
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/product1.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/pro2.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/product3.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/pro4.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/pro5.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/pro6.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/pro7.jpg', 'T-shirt'),
('Cartoon Astronaut T-Shirt', 'Adidas', 78.00, 'image/product/pro8.jpg', 'T-shirt');
