-- =============================================================
-- Assignment 2 - Web Backend Development (CSE 340)
-- Task One: SQL CRUD Statements
-- File: assignment2.sql
-- =============================================================
-- -------------------------------------------------------
-- QUERY 1: INSERT a new record into the account table
-- Note: account_id and account_type are auto-handled
-- -------------------------------------------------------
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronMan'
    );
-- -------------------------------------------------------
-- QUERY 2: UPDATE Tony Stark's account_type to "Admin"
-- -------------------------------------------------------
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- -------------------------------------------------------
-- QUERY 3: DELETE the Tony Stark record from the database
-- -------------------------------------------------------
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
-- -------------------------------------------------------
-- QUERY 4: UPDATE the GM Hummer description
-- Replace "small interiors" with "a huge interior"
-- Uses PostgreSQL REPLACE() function
-- -------------------------------------------------------
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- -------------------------------------------------------
-- QUERY 5: INNER JOIN - Select make, model, and
-- classification name for "Sport" category vehicles
-- -------------------------------------------------------
SELECT inv.inv_make,
    inv.inv_model,
    cls.classification_name
FROM inventory AS inv
    INNER JOIN classification AS cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';
-- -------------------------------------------------------
-- QUERY 6: UPDATE inv_image and inv_thumbnail paths
-- Add "/vehicles" to the file path for all records
-- Uses PostgreSQL REPLACE() function
-- -------------------------------------------------------
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
-- =============================================================
-- END OF ASSIGNMENT 2 - TASK ONE QUERIES
-- =============================================================