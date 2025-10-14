-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME,
    delivery_date DATETIME,
    total_price DECIMAL(10,2),
    advance_payment DECIMAL(10,2),
    advance_payment_status VARCHAR(20) DEFAULT 'unpaid',
    balance_payment DECIMAL(10,2),
    balance_payment_status VARCHAR(20) DEFAULT 'unpaid',
    order_status VARCHAR(20) DEFAULT 'pending',
    customer_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create order_list table
CREATE TABLE IF NOT EXISTS order_list (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_each DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
