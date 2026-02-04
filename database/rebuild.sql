
DROP TYPE IF EXISTS account_type CASCADE;
DROP TABLE IF EXISTS inventory, classification, account CASCADE;

CREATE TYPE account_type AS ENUM ('Client','Employee','Admin');


CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(100) NOT NULL,
  inv_model VARCHAR(100) NOT NULL,
  inv_year INTEGER NOT NULL,
  classification_id INTEGER REFERENCES classification(classification_id),
  inv_description TEXT,
  inv_image TEXT,
  inv_thumbnail TEXT,
  inv_price NUMERIC(10,2),
  inv_miles INTEGER,
  inv_color VARCHAR(50)
);

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50),
  account_lastname VARCHAR(50),
  account_email VARCHAR(100) UNIQUE,
  account_password VARCHAR(255),
  account_type account_type DEFAULT 'Client'
);


INSERT INTO classification (classification_name) VALUES
  ('Sport'),
  ('Pickup'),
  ('SUV'),
  ('Sedan');


INSERT INTO inventory (inv_make, inv_model, inv_year, classification_id, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES
  ('Lamborghini', 'Aventador', 2023, 1, 'Do you have 6 kids and like to go offroading? The Aventador is not for you. This car is all about speed, luxury, and style.', '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg', 295000.00, 2500, 'Red'),
  ('Chevrolet', 'Camaro', 2022, 1, 'A classic American muscle car with modern performance. Perfect for those who appreciate raw power and iconic styling.', '/images/vehicles/camaro.jpg', '/images/vehicles/camaro-tn.jpg', 45000.00, 12000, 'Yellow'),
  ('DeLorean', 'DMC-12', 1981, 1, 'Where we''re going, we don''t need roads! The iconic time machine from Back to the Future.', '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 75000.00, 45000, 'Silver'),
  ('Ford', 'F-150', 2020, 2, 'A reliable pickup truck for work and weekend adventures.', '/images/vehicles/monster-truck.jpg', '/images/vehicles/monster-truck-tn.jpg', 42000.00, 30000, 'Blue'),
  ('GM', 'Hummer', 2021, 3, 'A rugged SUV with serious presence and capability.', '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg', 65000.00, 35000, 'Black'),
  ('Jeep', 'Wrangler', 2020, 3, 'Off-road capability meets everyday practicality in this iconic SUV.', '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg', 38000.00, 28000, 'Green'),
  ('Ford', 'Crown Victoria', 2011, 4, 'A comfortable full-size sedan known for its durability.', '/images/vehicles/crwn-vic.jpg', '/images/vehicles/crwn-vic-tn.jpg', 9500.00, 125000, 'White');


INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Sample', 'User', 'sample@example.com', 'password123');


UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%'
  AND inv_image NOT LIKE '/images/vehicles/%';
