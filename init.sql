BEGIN;

-- Disable constraint checks temporarily
SET CONSTRAINTS ALL DEFERRED;

TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE catalogs CASCADE;
TRUNCATE TABLE pricing CASCADE;
TRUNCATE TABLE contracts CASCADE;

-- CATEGORIES
INSERT INTO categories (id, name, description) VALUES
(1, 'Electronics', 'Devices and gadgets'),
(2, 'Furniture', 'Office and home furniture'),
(3, 'Stationery', 'Office stationery and paper products'),
(4, 'Hardware', 'Tools and construction materials'),
(5, 'Groceries', 'Daily essentials and food items'),
(6, 'Fashion', 'Apparel and accessories'),
(7, 'Cleaning Supplies', 'Household cleaning items'),
(8, 'Toys', 'Kids and educational toys');


INSERT INTO suppliers (id, "company_name", "contact_person", "contact_email", "contact_phone", status)
VALUES
(1, 'ElectroMart Pvt Ltd', 'Ankit Sharma', 'ankit@electromart.com', '9876543210',1),
(2, 'HomeDeco Furnishings', 'Ritika Kapoor', 'ritika@homedeco.com', '9998833377',1),
(3, 'OfficeNeeds Co.', 'Manish Mehta', 'manish@officeneeds.com', '9887766554',1),
(4, 'DailyFresh Supplies', 'Ayesha Khan', 'ayesha@dailyfresh.com', '9765432109',1),
(5, 'ToyPlanet', 'Vikram Rao', 'vikram@toyplanet.com', '9955443322',1);

INSERT INTO catalogs (id, sku, description, "categoryId", "supplierId")
VALUES
-- Electronics
(1, 'ELEC-001', 'Wireless Bluetooth Headphones', 1, 1),
(2, 'ELEC-002', 'Smart LED TV 42 Inch', 1, 1),
(3, 'ELEC-003', 'Portable Power Bank 10000mAh', 1, 1),
(4, 'ELEC-004', 'Smartphone Charger USB-C 25W', 1, 1),
(5, 'ELEC-005', 'Wireless Mouse', 1, 1),
(6, 'ELEC-006', 'Laptop Cooling Pad', 1, 1),
(7, 'ELEC-007', 'Wi-Fi Router Dual Band', 1, 1),

-- Furniture
(8, 'FURN-001', 'Ergonomic Office Chair', 2, 2),
(9, 'FURN-002', 'Wooden Study Table', 2, 2),
(10, 'FURN-003', 'Glass Top Coffee Table', 2, 2),
(11, 'FURN-004', 'King Size Bed Frame', 2, 2),
(12, 'FURN-005', 'Wall Mounted Bookshelf', 2, 2),
(13, 'FURN-006', 'Recliner Sofa Set', 2, 2),

-- Stationery
(14, 'STAT-001', 'A4 Paper Ream (500 Sheets)', 3, 3),
(15, 'STAT-002', 'Ballpoint Pen Blue Ink', 3, 3),
(16, 'STAT-003', 'Highlighter Set 5 Colors', 3, 3),
(17, 'STAT-004', 'Sticky Notes 3x3 Inches', 3, 3),
(18, 'STAT-005', 'Whiteboard Marker Black', 3, 3),
(19, 'STAT-006', 'Permanent Marker Red', 3, 3),
(20, 'STAT-007', 'Spiral Notebook 200 Pages', 3, 3),
(21, 'STAT-008', 'Desk Organizer', 3, 3),

-- Hardware
(22, 'HARD-001', 'Hammer with Wooden Handle', 4, 3),
(23, 'HARD-002', 'Screwdriver Set of 6', 4, 3),
(24, 'HARD-003', 'Adjustable Wrench 12 Inch', 4, 3),
(25, 'HARD-004', 'Electric Drill Machine 600W', 4, 3),
(26, 'HARD-005', 'Measuring Tape 5 Meter', 4, 3),
(27, 'HARD-006', 'Steel Nails Pack of 100', 4, 3),
(28, 'HARD-007', 'Paint Brush Set 3 Sizes', 4, 3),

-- Groceries
(29, 'GROC-001', 'Basmati Rice 5kg Pack', 5, 4),
(30, 'GROC-002', 'Refined Sunflower Oil 1L', 5, 4),
(31, 'GROC-003', 'Organic Turmeric Powder 500g', 5, 4),
(32, 'GROC-004', 'Wheat Flour 10kg', 5, 4),
(33, 'GROC-005', 'Instant Coffee 200g Jar', 5, 4),
(34, 'GROC-006', 'Green Tea Bags 100 Pack', 5, 4),
(35, 'GROC-007', 'Sugar 1kg Pack', 5, 4),

-- Fashion
(36, 'FASH-001', 'Men Cotton T-Shirt Blue', 6, 4),
(37, 'FASH-002', 'Women Denim Jacket', 6, 4),
(38, 'FASH-003', 'Men Formal Shirt White', 6, 4),
(39, 'FASH-004', 'Women Casual Kurti', 6, 4),
(40, 'FASH-005', 'Unisex Sports Shoes', 6, 4),
(41, 'FASH-006', 'Leather Wallet Brown', 6, 4),
(42, 'FASH-007', 'Analog Wrist Watch', 6, 4),

-- Cleaning Supplies
(43, 'CLEAN-001', 'Liquid Floor Cleaner 1L', 7, 4),
(44, 'CLEAN-002', 'Dishwashing Liquid 750ml', 7, 4),
(45, 'CLEAN-003', 'Laundry Detergent Powder 2kg', 7, 4),
(46, 'CLEAN-004', 'Glass Cleaner Spray 500ml', 7, 4),
(47, 'CLEAN-005', 'Mop and Bucket Set', 7, 4),
(48, 'CLEAN-006', 'Air Freshener 250ml', 7, 4),

-- Toys
(49, 'TOY-001', 'Lego Building Blocks 500pcs', 8, 5),
(50, 'TOY-002', 'Remote Control Car', 8, 5),
(51, 'TOY-003', 'Barbie Doll', 8, 5),
(52, 'TOY-004', 'Rubik Cube 3x3', 8, 5),
(53, 'TOY-005', 'Soft Teddy Bear 2ft', 8, 5),
(54, 'TOY-006', 'Mini Drone Toy', 8, 5);

INSERT INTO pricing ("supplierId", "catalogsId", "baseRate", "minQty", "discountPercent")
VALUES
-- =====================
-- Electronics (Supplier 1 - ElectroMart Pvt Ltd)
-- =====================
(1, 1, 1799.00, 1, 0),
(1, 2, 28999.00, 1, 5),
(1, 3, 999.00, 1, 3),
(1, 4, 499.00, 5, 2),
(1, 5, 699.00, 10, 5),
(1, 6, 1199.00, 5, 3),
(1, 7, 2499.00, 3, 4),

-- =====================
-- Furniture (Supplier 2 - HomeDeco Furnishings)
-- =====================
(2, 8, 8499.00, 1, 5),
(2, 9, 5499.00, 1, 4),
(2, 10, 3999.00, 1, 3),
(2, 11, 14999.00, 1, 6),
(2, 12, 2999.00, 5, 5),
(2, 13, 19999.00, 1, 8),

-- =====================
-- Stationery + Hardware (Supplier 3 - OfficeNeeds Co.)
-- =====================
-- Stationery
(3, 14, 320.00, 10, 2),
(3, 15, 12.00, 100, 5),
(3, 16, 120.00, 20, 4),
(3, 17, 45.00, 50, 3),
(3, 18, 25.00, 20, 2),
(3, 19, 18.00, 50, 2),
(3, 20, 85.00, 10, 4),
(3, 21, 249.00, 5, 3),

-- Hardware
(3, 22, 499.00, 5, 3),
(3, 23, 699.00, 5, 4),
(3, 24, 899.00, 3, 5),
(3, 25, 2899.00, 1, 4),
(3, 26, 149.00, 10, 3),
(3, 27, 99.00, 20, 2),
(3, 28, 179.00, 15, 4),

-- =====================
-- Groceries + Fashion + Cleaning (Supplier 4 - DailyFresh Supplies)
-- =====================
-- Groceries
(4, 29, 499.00, 1, 2),
(4, 30, 180.00, 5, 3),
(4, 31, 220.00, 5, 4),
(4, 32, 540.00, 1, 2),
(4, 33, 280.00, 10, 3),
(4, 34, 350.00, 10, 3),
(4, 35, 60.00, 20, 2),

-- Fashion
(4, 36, 499.00, 5, 4),
(4, 37, 1299.00, 3, 5),
(4, 38, 699.00, 5, 4),
(4, 39, 899.00, 5, 3),
(4, 40, 1799.00, 3, 6),
(4, 41, 599.00, 5, 4),
(4, 42, 1199.00, 2, 3),

-- Cleaning
(4, 43, 150.00, 10, 3),
(4, 44, 120.00, 10, 2),
(4, 45, 499.00, 5, 4),
(4, 46, 130.00, 10, 3),
(4, 47, 799.00, 2, 5),
(4, 48, 210.00, 10, 4),

-- =====================
-- Toys (Supplier 5 - ToyPlanet)
-- =====================
(5, 49, 2199.00, 2, 4),
(5, 50, 1799.00, 3, 5),
(5, 51, 999.00, 5, 4),
(5, 52, 249.00, 10, 3),
(5, 53, 799.00, 3, 5),
(5, 54, 2999.00, 1, 6);

INSERT INTO contracts (supplier_id, contract_title, terms_and_conditions, effective_from, expires_on, contract_status)
VALUES
(1, 'Annual Supply Agreement', 'Supplier agrees to deliver products under negotiated rates with quarterly review.', '2025-01-01', '2025-12-31',1),
(2, '3-Year Maintenance Contract', 'Supplier provides yearly maintenance and warranty for equipment supplied.', '2024-05-01', '2027-05-01', 1),
(3, 'Short-Term Procurement Contract', 'Supplier will supply 500 units of Item A at fixed rate. Late delivery penalty applies.', '2025-02-01', '2025-08-01', 1),
(4, 'Distribution Partnership', 'Supplier authorized as distributor with 10% commission on all regional sales.', '2024-03-01', '2026-03-01',1),
(5, 'Expired Bulk Supply Contract', 'Supplier delivered 10,000 units at a negotiated bulk discount rate.', '2022-01-01', '2023-12-31',1);


COMMIT;
