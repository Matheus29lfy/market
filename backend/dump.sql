-- Criação da tabela 'products'
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    quantity INT NOT NULL,
    type_category_id INT NOT NULL,
    FOREIGN KEY (type_category_id) REFERENCES type_products(id)
);

-- Criação da tabela 'type_products'
CREATE TABLE IF NOT EXISTS type_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Criação da tabela 'categories'
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Criação da tabela 'sells'
CREATE TABLE IF NOT EXISTS sells (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_no_tax DECIMAL(10, 2) NOT NULL,
    total_with_taxes DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Criação da tabela 'users'
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'not-admin'))
);

-- Inserção de dados na tabela 'type_products'
INSERT INTO type_products (name) VALUES 
('Electronics'), 
('Books'), 
('Clothing');

-- Inserção de dados na tabela 'categories'
INSERT INTO categories (name) VALUES 
('Smartphones'), 
('Laptops'), 
('Fiction'), 
('Non-Fiction'), 
('Men'), 
('Women');

-- Inserção de dados na tabela 'products'
INSERT INTO products (name, price, description, quantity, type_category_id) VALUES 
('iPhone 12', 799.99, 'Latest Apple iPhone', 50, 1),
('MacBook Pro', 1299.99, 'Apple MacBook Pro 13 inch', 30, 1),
('Harry Potter', 19.99, 'Fiction book by J.K. Rowling', 100, 2),
('Blue T-Shirt', 9.99, 'Comfortable cotton t-shirt', 200, 3);

-- Inserção de dados na tabela 'sells'
INSERT INTO sells (product_id, quantity, total_no_tax, total_with_taxes) VALUES 
(1, 2, 1599.98, 1759.98),
(3, 5, 99.95, 109.95);

-- Inserção de dados na tabela 'users'
INSERT INTO users (username, password, email, role) VALUES 
('admin_user', 'admin_pass', 'admin@example.com', 'admin'),
('regular_user', 'user_pass', 'user@example.com', 'not-admin');
