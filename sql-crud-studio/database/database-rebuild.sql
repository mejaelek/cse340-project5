-- =============================================================
-- Assignment 2 - Web Backend Development (CSE 340)
-- Task Two: Database Rebuild File
-- Creates the PostgreSQL type, all three tables, and inserts data
-- Run this file to completely rebuild the database from scratch
-- =============================================================
-- -------------------------------------------------------
-- DROP existing tables (safe rebuild order)
-- -------------------------------------------------------
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TYPE IF EXISTS account_type CASCADE;
-- -------------------------------------------------------
-- CREATE the account_type ENUM type
-- -------------------------------------------------------
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');
-- -------------------------------------------------------
-- TABLE 1: classification
-- -------------------------------------------------------
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(30) NOT NULL UNIQUE
);
-- -------------------------------------------------------
-- TABLE 2: account
-- -------------------------------------------------------
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(200) NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'
);
-- -------------------------------------------------------
-- TABLE 3: inventory
-- -------------------------------------------------------
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year NUMERIC(4, 0) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(200) NOT NULL,
    inv_thumbnail VARCHAR(200) NOT NULL,
    inv_price NUMERIC(9, 0) NOT NULL,
    inv_miles NUMERIC(9, 0) NOT NULL,
    inv_color VARCHAR(50) NOT NULL,
    classification_id INT NOT NULL,
    CONSTRAINT fk_classification FOREIGN KEY (classification_id) REFERENCES classification(classification_id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- =============================================================
-- INSERT DATA
-- =============================================================
-- -------------------------------------------------------
-- Classification data
-- -------------------------------------------------------
INSERT INTO classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan');
-- -------------------------------------------------------
-- Account data (sample users)
-- -------------------------------------------------------
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
    )
VALUES (
        'Basic',
        'Client',
        'client@example.com',
        'hashed_password_1',
        'Client'
    ),
    (
        'Site',
        'Employee',
        'employee@example.com',
        'hashed_password_2',
        'Employee'
    ),
    (
        'Site',
        'Admin',
        'admin@example.com',
        'hashed_password_3',
        'Admin'
    );
-- -------------------------------------------------------
-- Inventory data
-- -------------------------------------------------------
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES -- Custom (id=1)
    (
        'Batmobile',
        'Custom',
        2021,
        'The iconic black Batmobile, capable of 0-60 in under 4 seconds with cutting-edge stealth tech.',
        '/images/vehicles/batmobile.jpg',
        '/images/vehicles/tn-batmobile.jpg',
        125000,
        12000,
        'Black',
        1
    ),
    (
        'Delorean',
        'DMC-12',
        1981,
        'Back to the Future edition — flux capacitor included. Stainless steel body, gull-wing doors.',
        '/images/vehicles/delorean.jpg',
        '/images/vehicles/tn-delorean.jpg',
        45000,
        88000,
        'Silver',
        1
    ),
    -- Sport (id=2)
    (
        'Lamborghini',
        'Aventador',
        2022,
        'Sleek Sport supercar with a 6.5L V12 engine pushing 769 hp, 0-60 in 2.8 seconds.',
        '/images/vehicles/lamborghini.jpg',
        '/images/vehicles/tn-lamborghini.jpg',
        393000,
        5000,
        'Yellow',
        2
    ),
    (
        'Ford',
        'Mustang GT500',
        2020,
        'American muscle Sport car with a supercharged 5.2L V8 producing 760 hp. Track-ready.',
        '/images/vehicles/mustang.jpg',
        '/images/vehicles/tn-mustang.jpg',
        75000,
        18000,
        'Red',
        2
    ),
    (
        'Dodge',
        'Challenger SRT',
        2021,
        'Wide-body Sport muscle with a 6.2L Hellcat engine, 717 hp. Aggressive stance and roar.',
        '/images/vehicles/challenger.jpg',
        '/images/vehicles/tn-challenger.jpg',
        62000,
        9000,
        'Orange',
        2
    ),
    -- SUV (id=3)
    (
        'GM',
        'Hummer',
        2006,
        'A massive SUV with small interiors but legendary off-road capability. Diesel turbo, 4WD.',
        '/images/vehicles/hummer.jpg',
        '/images/vehicles/tn-hummer.jpg',
        58000,
        75000,
        'Green',
        3
    ),
    (
        'Jeep',
        'Wrangler Rubicon',
        2022,
        'Trail-rated SUV built for serious off-roading. 3.6L Pentastar V6, removable doors and roof.',
        '/images/vehicles/wrangler.jpg',
        '/images/vehicles/tn-wrangler.jpg',
        48000,
        15000,
        'Blue',
        3
    ),
    -- Truck (id=4)
    (
        'Ford',
        'F-150 Raptor',
        2022,
        'High-performance Truck with a 3.5L twin-turbo EcoBoost V6, 450 hp, off-road suspension.',
        '/images/vehicles/f150.jpg',
        '/images/vehicles/tn-f150.jpg',
        68000,
        22000,
        'White',
        4
    ),
    (
        'Chevy',
        'Silverado 1500',
        2021,
        'Workhorse Truck with a 6.2L V8, 420 hp, max towing 13,300 lbs. Available in multiple cabs.',
        '/images/vehicles/silverado.jpg',
        '/images/vehicles/tn-silverado.jpg',
        52000,
        30000,
        'Gray',
        4
    ),
    -- Sedan (id=5)
    (
        'Tesla',
        'Model 3',
        2023,
        'All-electric Sedan with 358-mile range, Autopilot, and 0-60 mph in 3.1 seconds.',
        '/images/vehicles/tesla3.jpg',
        '/images/vehicles/tn-tesla3.jpg',
        42000,
        8000,
        'White',
        5
    ),
    (
        'BMW',
        '3 Series',
        2022,
        'Luxury sport Sedan with a 2.0L turbocharged inline-4, 255 hp, rear-wheel drive dynamics.',
        '/images/vehicles/bmw3.jpg',
        '/images/vehicles/tn-bmw3.jpg',
        47000,
        14000,
        'Black',
        5
    );
-- =============================================================
-- TASK ONE QUERIES (copies 4 and 6 from assignment2.sql)
-- Run after rebuilding to re-apply task one transformations
-- =============================================================
-- Q4: Fix GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Q6: Fix image paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
-- =============================================================
-- VERIFY: Show all structures and data
-- =============================================================
SELECT 'classification' AS tbl,
    COUNT(*) AS rows
FROM classification
UNION ALL
SELECT 'account',
    COUNT(*)
FROM account
UNION ALL
SELECT 'inventory',
    COUNT(*)
FROM inventory;
-- =============================================================
-- END OF DATABASE REBUILD FILE
-- =============================================================