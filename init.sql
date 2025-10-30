BEGIN;

-- Disable constraint checks temporarily
SET CONSTRAINTS ALL DEFERRED;

TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE contacts CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE catalogs CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE stock CASCADE;
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE contracts CASCADE;
TRUNCATE TABLE order_history CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE sessions CASCADE;

--suppliers
INSERT INTO suppliers (id, name, contact_email, phone, address, is_active, updated_at, created_at) VALUES
(1, 'Reliance Distributors', 'contact@reliancedist.in', '022-40012345', '1 Reliance House, Mumbai', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Tata Wholesale', 'info@tatawholesale.com', '011-23456789', '2 Tata Towers, Delhi', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Apollo Suppliers', 'mail@apollosupp.com', '040-56001234', '3 Apollo Lane, Hyderabad', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Flipkart Partners', 'help@flipkartpartner.in', '080-33001234', '4 E-commerce Road, Bengaluru', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Mahindra Logistics', 'support@mahindralog.in', '020-22334455', '5 Transport Street, Pune', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Vedanta Merchants', 'connect@vedantamerc.com', '033-22992299', '6 Market Place, Kolkata', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Infosys Supplies', 'contact@infosyssup.in', '080-44889900', '7 IT City, Mysore', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Hindalco Distributors', 'care@hindalcodist.com', '0172-3334455', '8 Industrial Zone, Chandigarh', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Godrej Mart', 'hello@godrejmart.in', '022-44005511', '9 Godrej Lane, Mumbai', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Zomato Procurement', 'contact@zomatoproc.com', '080-55443322', '10 Food Tech Park, Bengaluru', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'ITC Vendor Services', 'vendor@itcvendor.com', '033-26880011', '11 FMCG Road, Kolkata', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Bajaj Traders', 'sales@bajajtraders.in', '020-55443322', '12 Bajaj Nagar, Pune', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Aditya Birla Supp.', 'info@birlasupp.com', '022-55335544', '13 Corporate Park, Thane', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Infoserve Hub', 'hello@infoservehub.com', '044-66773322', '14 Tech City, Chennai', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Asian Paints Allied', 'contact@asianallied.in', '022-44332211', '15 Color Drive, Mumbai', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--users
INSERT INTO users (id, name, email, password_hash, role, supplier_id, is_active, updated_at, created_at) VALUES
(1, 'Amit Sharma', 'amit.sharma@domain.com', 'your_hash_1', 'admin', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Priya Singh', 'priya.singh@domain.com', 'your_hash_2', 'vendor', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Vikram Mehra', 'vikram.mehra@domain.com', 'your_hash_3', 'approver', 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Deepa Rao', 'deepa.rao@domain.com', 'your_hash_4', 'buyer', 4, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Rohit Kulkarni', 'rohit.kulkarni@domain.com', 'your_hash_5', 'admin', 5, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Sneha Nair', 'sneha.nair@domain.com', 'your_hash_6', 'vendor', 6, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Karan Verma', 'karan.verma@domain.com', 'your_hash_7', 'approver', 7, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Meera Chopra', 'meera.chopra@domain.com', 'your_hash_8', 'buyer', 8, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Rahul Sinha', 'rahul.sinha@domain.com', 'your_hash_9', 'admin', 9, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Ayesha Patel', 'ayesha.patel@domain.com', 'your_hash_10', 'vendor', 10, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'Sandeep Yadav', 'sandeep.yadav@domain.com', 'your_hash_11', 'approver', 11, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Neha Gupta', 'neha.gupta@domain.com', 'your_hash_12', 'buyer', 12, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Abhishek Joshi', 'abhishek.joshi@domain.com', 'your_hash_13', 'admin', 13, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Divya Menon', 'divya.menon@domain.com', 'your_hash_14', 'vendor', 14, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Yogesh Desai', 'yogesh.desai@domain.com', 'your_hash_15', 'buyer', 15, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- contacts
INSERT INTO contacts (id, supplier_id, name, email, phone, designation, updated_at, created_at) VALUES
(1, 1, 'Rakesh Kumar', 'rakesh.kumar@reliancedist.in', '9876543101', 'Manager', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'Sunita Iyer', 'sunita.iyer@tatawholesale.com', '9876543102', 'Head Sales', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'Manoj Nair', 'manoj.nair@apollosupp.com', '9876543103', 'Director', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, 'Isha Banerjee', 'isha.banerjee@flipkartpartner.in', '9876543104', 'Accountant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 5, 'Anil Pathak', 'anil.pathak@mahindralog.in', '9876543105', 'Logistics Lead', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 6, 'Pooja Gupta', 'pooja.gupta@vedantamerc.com', '9876543106', 'Support', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 7, 'Nitin Chawla', 'nitin.chawla@infosyssup.in', '9876543107', 'Store Incharge', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 8, 'Aarti Verma', 'aarti.verma@hindalcodist.com', '9876543108', 'Supervisor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 9, 'Santosh Jain', 'santosh.jain@godrejmart.in', '9876543109', 'Purchase Officer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 10, 'Shalini Sharma', 'shalini.sharma@zomatoproc.com', '9876543110', 'Procurement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 11, 'Ajay Singh', 'ajay.singh@itcvendor.com', '9876543111', 'Sales Manager', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 12, 'Rajiv Pillai', 'rajiv.pillai@bajajtraders.in', '9876543112', 'Director', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 13, 'Madhuri Das', 'madhuri.das@birlasupp.com', '9876543113', 'Finance Head', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 14, 'Kiran Deshmukh', 'kiran.deshmukh@infoservehub.com', '9876543114', 'Assistant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 15, 'Varun Bhargava', 'varun.bhargava@asianallied.in', '9876543115', 'Senior Manager', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- categories
INSERT INTO categories (id, name, is_active, created_at) VALUES
(1, 'Electronics', TRUE, CURRENT_TIMESTAMP),
(2, 'Office Supplies', TRUE, CURRENT_TIMESTAMP),
(3, 'Groceries', TRUE, CURRENT_TIMESTAMP),
(4, 'Home Appliances', TRUE, CURRENT_TIMESTAMP),
(5, 'Textiles', TRUE, CURRENT_TIMESTAMP),
(6, 'Furniture', TRUE, CURRENT_TIMESTAMP),
(7, 'Automotive', TRUE, CURRENT_TIMESTAMP),
(8, 'Personal Care', TRUE, CURRENT_TIMESTAMP),
(9, 'Construction', TRUE, CURRENT_TIMESTAMP),
(10, 'Farm Supplies', TRUE, CURRENT_TIMESTAMP),
(11, 'IT Hardware', TRUE, CURRENT_TIMESTAMP),
(12, 'Cleaning', TRUE, CURRENT_TIMESTAMP);

-- catalogs
INSERT INTO catalogs (id, supplier_id, name, description, is_active, created_at) VALUES
(1, 1, 'ElectroCart', 'Latest electronic gadgets', TRUE, CURRENT_TIMESTAMP),
(2, 2, 'OfficeMart', 'Quality office supplies', TRUE, CURRENT_TIMESTAMP),
(3, 3, 'GroceryBox', 'Groceries and edibles wholesale', TRUE, CURRENT_TIMESTAMP),
(4, 4, 'HomeApplia', 'Home appliance deals', TRUE, CURRENT_TIMESTAMP),
(5, 5, 'TextileBazaar', 'Fabric and apparel', TRUE, CURRENT_TIMESTAMP),
(6, 6, 'FurniShop', 'Trendy furniture', TRUE, CURRENT_TIMESTAMP),
(7, 7, 'AutoParts', 'Car and bike accessories', TRUE, CURRENT_TIMESTAMP),
(8, 8, 'BodyCare', 'Wellness & beauty products', TRUE, CURRENT_TIMESTAMP),
(9, 9, 'BuildPro', 'Construction essentials', TRUE, CURRENT_TIMESTAMP),
(10, 10, 'FarmStore', 'Goods for agriculture', TRUE, CURRENT_TIMESTAMP),
(11, 11, 'TechWorld', 'Computing devices', TRUE, CURRENT_TIMESTAMP),
(12, 12, 'CleanAll', 'Cleaners & disinfectants', TRUE, CURRENT_TIMESTAMP);


INSERT INTO products (id, catalog_id, category_id, supplier_id, name, sku, description, price, currency, min_quantity, max_quantity, total_quantity, created_at, updated_at, is_active)
VALUES
(1, 1, 1, 1, 'Smartphone Model A', 'SM-A-001', 'Latest 5G smartphone', 18500.00, 'Rs', 1, 5, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(2, 1, 1, 1, 'Bluetooth Headphones', 'BT-H-002', 'Noise-cancelling headphones', 3500.00, 'Rs', 1, 10, 210, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(3, 2, 2, 2, 'Executive Chair', 'EX-CH-003', 'Ergonomic office chair', 9800.00, 'Rs', 2, 20, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(4, 2, 2, 2, 'A4 Paper Box', 'A4-PB-004', 'Box of 500 sheets', 350.00, 'Rs', 1, 200, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(5, 3, 3, 3, 'Basmati Rice 10kg', 'BSM-RC-005', 'Premium quality rice', 980.00, 'Rs', 1, 50, 400, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(6, 3, 3, 3, 'Sunflower Oil 5L', 'SF-OIL-006', 'Refined sunflower oil', 640.00, 'Rs', 2, 15, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(7, 5, 5, 5, 'Pure Cotton Saree', 'CTN-SA-007', 'Traditional Indian saree', 1500.00, 'Rs', 1, 30, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(8, 4, 4, 4, 'Mixer Grinder', 'MX-GR-008', 'Multipurpose mixer', 4400.00, 'Rs', 1, 10, 74, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(9, 6, 6, 6, 'Wooden Dining Table', 'WD-DT-009', '6-seater with glass top', 15500.00, 'Rs', 1, 3, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(10, 8, 8, 8, 'Herbal Shampoo', 'HRB-SH-010', '250ml, natural formula', 220.00, 'Rs', 3, 72, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(11, 7, 7, 7, 'Alloy Wheel Cover', 'AWC-011', 'Car accessory', 3500.00, 'Rs', 1, 10, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(12, 10, 10, 10, 'Organic Fertilizer 20kg', 'OFZ-012', 'Improves farm yield', 740.00, 'Rs', 2, 20, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(13, 11, 11, 11, 'Laptop Model X', 'LAP-X-013', 'Business laptop', 41000.00, 'Rs', 1, 5, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(14, 12, 12, 12, 'Floor Cleaner 5L', 'FC-014', 'Lemon fragrance', 350.00, 'Rs', 2, 40, 112, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(15, 6, 6, 6, 'Office Work Desk', 'OWD-015', 'Low-height design', 4100.00, 'Rs', 2, 8, 39, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(16, 5, 5, 5, 'Cotton Bedsheet', 'CB-016', 'King size', 750.00, 'Rs', 1, 20, 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(17, 9, 9, 9, 'Cement 50kg', 'CM-017', 'Construction cement', 460.00, 'Rs', 2, 100, 800, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(18, 6, 6, 6, 'Steel Chair', 'SC-018', 'Stackable', 600.00, 'Rs', 2, 30, 47, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(19, 8, 8, 8, 'Aloe Vera Gel', 'AVG-019', '100ml cosmetic', 125.00, 'Rs', 3, 100, 345, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(20, 4, 4, 4, 'Air Purifier', 'AP-020', 'For home use', 7500.00, 'Rs', 1, 4, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(21, 1, 1, 1, 'Powerbank 20000mAh', 'PB20-021', 'Fast charge', 1300.00, 'Rs', 2, 20, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(22, 2, 2, 2, 'Pens Pack (10)', 'PEN-022', 'Blue ink ball pens', 90.00, 'Rs', 5, 200, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(23, 3, 3, 3, 'Atta 10kg', 'AT-023', 'Wheat flour', 375.00, 'Rs', 1, 40, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(24, 5, 5, 5, 'Denim Jeans', 'DJ-024', 'Regular fit', 1200.00, 'Rs', 2, 15, 41, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(25, 7, 7, 7, 'Bike Helmet', 'BH-025', 'ISI certified', 850.00, 'Rs', 1, 13, 33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(26, 8, 8, 8, 'Rose Soap Pack', 'RSP-026', 'Pack of 5', 75.00, 'Rs', 5, 50, 350, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(27, 10, 10, 10, 'Tractor Tyre', 'TT-027', 'Heavy duty', 6400.00, 'Rs', 1, 4, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(28, 9, 9, 9, 'Bricks (1000 pc)', 'BRK-028', 'Red brick lot', 5200.00, 'Rs', 1, 25, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(29, 11, 11, 11, 'Server Rack', 'SR-029', '12U steel rack', 8900.00, 'Rs', 1, 3, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(30, 12, 12, 12, 'Toilet Cleaner', 'TC-030', '750ml', 98.00, 'Rs', 3, 36, 144, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(31, 10, 10, 10, 'Hybrid Rice Seeds', 'HRS-031', 'High yield', 945.00, 'Rs', 4, 40, 82, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(32, 8, 8, 8, 'Neem Soap', 'NS-032', 'Antibacterial', 32.00, 'Rs', 10, 120, 700, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(33, 3, 3, 3, 'Moong Dal 5kg', 'MD-033', 'Premium lentils', 510.00, 'Rs', 1, 30, 52, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(34, 7, 7, 7, 'Car Perfume', 'CP-034', 'Strawberry fragrance', 195.00, 'Rs', 1, 25, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(35, 1, 1, 1, 'Smartwatch Basic', 'SWB-035', 'Fitness tracking', 2499.00, 'Rs', 1, 8, 33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(36, 2, 2, 2, 'Stapler Set', 'SS-036', 'Desk stapler + pins', 145.00, 'Rs', 1, 30, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(37, 5, 5, 5, 'Kurti Cotton', 'KC-037', 'Ladies wear', 650.00, 'Rs', 2, 12, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(38, 4, 4, 4, 'Induction Cooktop', 'IC-038', '2000W digital', 3300.00, 'Rs', 1, 6, 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(39, 6, 6, 6, 'Revolving Chair', 'RC-039', 'Adjustable height', 3550.00, 'Rs', 1, 10, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(40, 9, 9, 9, 'Iron Rod (1Ton)', 'IR-040', 'TMT bars', 53000.00, 'Rs', 1, 2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(41, 3, 3, 3, 'Black Pepper 1kg', 'BP-041', 'Whole spice', 960.00, 'Rs', 1, 12, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(42, 12, 12, 12, 'Glass Cleaner', 'GC-042', '500ml', 86.00, 'Rs', 5, 50, 230, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(43, 7, 7, 7, 'Bike Cover', 'BIC-043', 'Waterproof', 425.00, 'Rs', 2, 22, 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(44, 10, 10, 10, 'Weed Cutter', 'WC-044', 'Manual tool', 355.00, 'Rs', 1, 6, 24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(45, 8, 8, 8, 'Hand Sanitizer Gel', 'HS-045', '500ml pump', 248.00, 'Rs', 2, 35, 122, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(46, 2, 2, 2, 'Correction Tape', 'CT-046', 'Blister pack', 38.00, 'Rs', 20, 150, 377, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(47, 6, 6, 6, 'Coffee Table', 'CFTB-047', 'Teak finish', 2400.00, 'Rs', 1, 6, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(48, 11, 11, 11, 'Wireless Mouse', 'WM-048', '2.4GHz', 449.00, 'Rs', 2, 25, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(49, 5, 5, 5, 'Shawl Woolen', 'WS-049', 'Winter shawl', 795.00, 'Rs', 1, 20, 34, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(50, 1, 1, 1, 'Tab Device', 'TAB-050', 'Simulator tab', 14300.00, 'Rs', 1, 6, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(51, 12, 12, 12, 'Disinfectant Liquid', 'DL-051', 'Lavender fresh', 285.00, 'Rs', 5, 30, 180, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(52, 11, 11, 11, 'Network Switch', 'NSW-052', '8 port, gigabit', 3990.00, 'Rs', 1, 10, 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(53, 2, 2, 2, 'Tape Dispenser', 'TD-053', 'Desktop type', 85.00, 'Rs', 2, 60, 130, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(54, 3, 3, 3, 'Sugar 5kg', 'SG-054', 'Grain sugar', 242.00, 'Rs', 2, 40, 215, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(55, 4, 4, 4, 'Chimney Hood', 'CHM-055', 'Stainless steel', 11500.00, 'Rs', 1, 3, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(56, 5, 5, 5, 'Boys T-shirt', 'BTS-056', 'Cotton graphic', 275.00, 'Rs', 1, 22, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(57, 6, 6, 6, 'Bookshelf', 'BSF-057', '5-tier', 3150.00, 'Rs', 1, 8, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(58, 7, 7, 7, 'Spark Plug Set', 'SPS-058', 'Set of 4', 780.00, 'Rs', 1, 16, 47, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(59, 8, 8, 8, 'Shaving Foam', 'SF-059', '200ml pack', 212.00, 'Rs', 1, 60, 215, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(60, 9, 9, 9, 'Sand 1 Ton', 'SND-060', 'River sand', 5900.00, 'Rs', 1, 12, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(61, 10, 10, 10, 'Sprayer Pump', 'SP-061', 'Agricultural', 340.00, 'Rs', 2, 16, 66, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(62, 11, 11, 11, 'Desktop PC i5', 'DPC-062', '8GB/512GB/22\"LCD', 52000.00, 'Rs', 1, 3, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(63, 12, 12, 12, 'Bleach Powder', 'BL-063', '5 kg tub', 440.00, 'Rs', 4, 50, 309, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(64, 1, 1, 1, 'Smartphone Model S', 'SMS-064', 'Flagship', 27500.00, 'Rs', 1, 3, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(65, 2, 2, 2, 'Printer Laser', 'PL-065', 'Mono laser printer', 9900.00, 'Rs', 1, 6, 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(66, 3, 3, 3, 'Toor Dal 5kg', 'TDL-066', 'High protein', 540.00, 'Rs', 1, 22, 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(67, 8, 8, 8, 'Hand Wash 250ml', 'HW-067', 'Antibacterial', 68.00, 'Rs', 2, 44, 112, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(68, 4, 4, 4, 'Toaster 4 Slice', 'TST-068', 'Stainless finish', 1850.00, 'Rs', 1, 4, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(69, 9, 9, 9, 'Stone Aggregate', 'SAG-069', 'per 100kg', 480.00, 'Rs', 1, 24, 53, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(70, 6, 6, 6, 'Bed Frame', 'BF-070', 'Queen-size metal', 4950.00, 'Rs', 1, 5, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE);

--stock
COMMIT;INSERT INTO stock (id, product_id, supplier_id, quantity, created_at, updated_at) VALUES
(1, 11, 7, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 12, 10, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 13, 11, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 14, 12, 112, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 15, 6, 39, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 16, 5, 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 17, 9, 800, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 18, 6, 47, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 19, 8, 345, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 20, 4, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 21, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 22, 2, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 23, 3, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 24, 5, 41, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 25, 7, 33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 26, 8, 350, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 27, 10, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 28, 9, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 29, 11, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, 30, 12, 144, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 31, 10, 82, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(22, 32, 8, 700, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, 33, 3, 52, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, 34, 7, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 35, 1, 33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(26, 36, 2, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, 37, 5, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, 38, 4, 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, 39, 6, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(30, 40, 9, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(31, 41, 3, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(32, 42, 12, 230, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(33, 43, 7, 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, 44, 10, 24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(35, 45, 8, 122, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(36, 46, 2, 377, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(37, 47, 6, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(38, 48, 11, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(39, 49, 5, 34, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(40, 50, 1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(41, 51, 12, 180, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(42, 52, 11, 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(43, 53, 2, 130, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(44, 54, 3, 215, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(45, 55, 4, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(46, 56, 5, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(47, 57, 6, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(48, 58, 7, 47, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(49, 59, 8, 215, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(50, 60, 9, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(51, 61, 10, 66, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(52, 62, 11, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(53, 63, 12, 309, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(54, 64, 1, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(55, 65, 2, 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(56, 66, 3, 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(57, 67, 8, 112, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(58, 68, 4, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(59, 69, 9, 53, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(60, 70, 6, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO contracts (buyer_id, supplier_id, contract_number, start_date, end_date, terms, is_active)
VALUES
(2, 1, 'CON-2025-001', '2025-01-10', '2025-12-31', 'Annual supply of electronics. Payment within 30 days.', TRUE),
(3, 2, 'CON-2025-002', '2025-02-01', '2025-12-31', 'Office furniture supply. Discount on bulk orders.', TRUE),
(4, 3, 'CON-2025-003', '2025-03-15', '2026-03-14', 'Exclusive supply for IT peripherals.', TRUE),
(2, 2, 'CON-2025-004', '2025-01-01', '2025-09-30', 'Quarterly review on delivery performance.', FALSE),
(5, 1, 'CON-2025-005', '2025-04-01', '2026-03-31', 'Hardware and accessories contract. Net 45 payment.', TRUE),
(3, 3, 'CON-2025-006', '2025-05-01', '2026-04-30', 'Priority shipping for urgent orders.', TRUE);


INSERT INTO cart_items (product_id, quantity, price, currency)
VALUES
(1, 2, 78000.00, 'INR'),
(2, 1, 15500.00, 'INR'),
(3, 3, 4200.00, 'INR'),
(4, 5, 9500.00, 'INR'),
(5, 2, 2899.00, 'INR'),
(6, 10, 1200.00, 'INR'),
(7, 1, 87000.00, 'INR');

INSERT INTO order_history (product_id, buyer_id, supplier_id, total_amount, is_active, status)
VALUES
(1, 2, 1, 156000.00, TRUE, 5),
(2, 3, 2, 15500.00, TRUE, 4),
(3, 2, 1, 12600.00, TRUE, 3),
(4, 5, 2, 47500.00, TRUE, 2),
(5, 4, 3, 5798.00, TRUE, 5),
(6, 3, 1, 12000.00, TRUE, 4),
(7, 5, 1, 87000.00, TRUE, 1);
