-- Insert test admin
INSERT IGNORE INTO admins (admin_id, admin_nic, admin_name, admin_password, created_at) 
VALUES (1, '991234567V', 'Test Admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW());

-- Insert test customer
INSERT IGNORE INTO customers (customer_id, customer_name, customer_email, customer_phone, created_at) 
VALUES (1, 'Test Customer', 'test@example.com', '1234567890', NOW());

-- Insert test product category
INSERT IGNORE INTO product_categories (pc_id, pc_name, created_at) 
VALUES (1, 'Printing', NOW());

-- Insert test products
INSERT IGNORE INTO products (product_id, product_name, product_description, product_price, availability, pc_id, created_at) 
VALUES 
(7, 'Passport Size Photos', 'Set of 4 printed passport size photos.', 300.00, 'in_stock', 1, NOW()),
(8, 'Visa Photos', 'Set of 2 printed visa size photos.', 250.00, 'in_stock', 1, NOW()),
(9, 'Photo Printing', 'High quality photo printing service.', 50.00, 'in_stock', 1, NOW());
