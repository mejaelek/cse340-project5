-- Database setup for CSE Motors
-- Create classification table
CREATE TABLE IF NOT EXISTS public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);
-- Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INTEGER NOT NULL CHECK (
        inv_year >= 1900
        AND inv_year <= 2100
    ),
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(200) NOT NULL,
    inv_thumbnail VARCHAR(200) NOT NULL,
    inv_price DECIMAL(10, 2) NOT NULL CHECK (inv_price >= 0),
    inv_miles INTEGER NOT NULL CHECK (inv_miles >= 0),
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES public.classification(classification_id)
);
-- Insert sample classification data
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan') ON CONFLICT (classification_name) DO NOTHING;
-- Insert sample inventory data (example for Delorean)
INSERT INTO public.inventory (
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
        'DMC',
        'Delorean',
        1981,
        'Epic, iconic vehicle of the 1980s. This is the car that started it all. In excellent condition with only 45,000 miles. Features include: 3 cup holders, Superman doors, and fuzzy dice! Don''t miss your chance to own a piece of automotive history.',
        '/images/vehicles/delorean.jpg',
        '/images/vehicles/delorean-tn.jpg',
        25000.00,
        45000,
        'Silver',
        (
            SELECT classification_id
            FROM public.classification
            WHERE classification_name = 'Custom'
        )
    ) ON CONFLICT DO NOTHING;
-- Add more sample vehicles as needed
INSERT INTO public.inventory (
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
        'Chevrolet',
        'Camaro',
        2023,
        'A powerful American muscle car with a sleek design. Features a V8 engine, sport suspension, and premium interior. Perfect for those who love speed and style.',
        '/images/vehicles/camaro.jpg',
        '/images/vehicles/camaro-tn.jpg',
        45000.00,
        15000,
        'Red',
        (
            SELECT classification_id
            FROM public.classification
            WHERE classification_name = 'Sport'
        )
    ),
    (
        'Ford',
        'F-150',
        2022,
        'America''s best-selling truck. Durable, reliable, and perfect for work or play. Features include 4x4 capability, towing package, and spacious cabin.',
        '/images/vehicles/f150.jpg',
        '/images/vehicles/f150-tn.jpg',
        52000.00,
        28000,
        'Blue',
        (
            SELECT classification_id
            FROM public.classification
            WHERE classification_name = 'Truck'
        )
    ),
    (
        'Toyota',
        'Highlander',
        2023,
        'Spacious family SUV with three rows of seating. Features advanced safety systems, all-wheel drive, and excellent fuel economy for its size.',
        '/images/vehicles/highlander.jpg',
        '/images/vehicles/highlander-tn.jpg',
        48000.00,
        12000,
        'White',
        (
            SELECT classification_id
            FROM public.classification
            WHERE classification_name = 'SUV'
        )
    ),
    (
        'Honda',
        'Accord',
        2023,
        'Reliable and efficient sedan perfect for daily commuting. Features include advanced safety features, comfortable interior, and excellent fuel economy.',
        '/images/vehicles/accord.jpg',
        '/images/vehicles/accord-tn.jpg',
        32000.00,
        8000,
        'Gray',
        (
            SELECT classification_id
            FROM public.classification
            WHERE classification_name = 'Sedan'
        )
    ) ON CONFLICT DO NOTHING;
-- Create session table for express-session
CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS = FALSE);
ALTER TABLE "session"
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");