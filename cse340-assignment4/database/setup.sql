-- =====================================================
-- database/setup.sql — Database Schema & Seed Data
-- Run once to initialize your PostgreSQL database
-- =====================================================
-- Classification table
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);
-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INTEGER NOT NULL CHECK (
        inv_year BETWEEN 1900 AND 9999
    ),
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(200) NOT NULL DEFAULT '/images/vehicles/no-image.png',
    inv_thumbnail VARCHAR(200) NOT NULL DEFAULT '/images/vehicles/no-image-tn.png',
    inv_price NUMERIC(9, 2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(30) NOT NULL,
    classification_id INTEGER NOT NULL REFERENCES classification(classification_id)
);
-- Seed classifications
INSERT INTO classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan') ON CONFLICT (classification_name) DO NOTHING;
-- Seed sample inventory
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
VALUES (
        'Chevy',
        'Camaro',
        2018,
        'A legendary muscle car with powerful performance and iconic styling.',
        '/images/vehicles/camaro.jpg',
        '/images/vehicles/camaro-tn.jpg',
        28000.00,
        45000,
        'Red',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Sport'
        )
    ),
    (
        'Ford',
        'F-150',
        2020,
        'America''s best-selling truck, built tough for any job.',
        '/images/vehicles/no-image.png',
        '/images/vehicles/no-image-tn.png',
        38000.00,
        22000,
        'Blue',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'Truck'
        )
    ),
    (
        'Toyota',
        'RAV4',
        2021,
        'A versatile compact SUV with excellent fuel economy.',
        '/images/vehicles/no-image.png',
        '/images/vehicles/no-image-tn.png',
        31000.00,
        15000,
        'Silver',
        (
            SELECT classification_id
            FROM classification
            WHERE classification_name = 'SUV'
        )
    ) ON CONFLICT DO NOTHING;