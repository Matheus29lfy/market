-- Dump do Banco de Dados com a Tabela Atualizada

-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role INTEGER NOT NULL
);

-- Tabela de Tipos de Produto
CREATE TABLE type_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type_product_id INTEGER REFERENCES type_products(id),
    quantity INTEGER NOT NULL
);

-- Tabela de Impostos
CREATE TABLE taxes (
    id SERIAL PRIMARY KEY,
    type_category_id INTEGER REFERENCES type_products(id),
    tax_percentage DECIMAL(5, 2) NOT NULL
);

-- Tabela de Vendas
CREATE TABLE sells (
    id SERIAL PRIMARY KEY,
    total_no_tax DECIMAL(10, 2) NOT NULL,
    total_with_taxes DECIMAL(10, 2) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos Vendidos
CREATE TABLE sell_products (
    id SERIAL PRIMARY KEY,
    sell_id INTEGER REFERENCES sells(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL
);

-- Inserções Iniciais (Opcional)
INSERT INTO users (username, password, role) VALUES ('admin', 'hashed_password', 1);

INSERT INTO type_products (name) VALUES ('Categoria 1');
INSERT INTO type_products (name) VALUES ('Categoria 2');

INSERT INTO products (name, price, type_product_id) VALUES ('Produto 1', 10.00, 1);
INSERT INTO products (name, price, type_product_id) VALUES ('Produto 2', 20.00, 2);

INSERT INTO taxes (type_product_id, name, tax_percentage) VALUES (1, 'Imposto A', 10.00);
INSERT INTO taxes (type_product_id, name, tax_percentage) VALUES (2, 'Imposto B', 20.00);