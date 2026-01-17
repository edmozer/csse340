
DROP TYPE IF EXISTS account_type CASCADE;
DROP TABLE IF EXISTS inventory, classification, account CASCADE;

CREATE TYPE account_type AS ENUM ('Customer','Admin');


CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(100) NOT NULL,
  inv_model VARCHAR(100) NOT NULL,
  classification_id INTEGER REFERENCES classification(classification_id),
  inv_description TEXT,
  inv_image TEXT,
  inv_thumbnail TEXT,
  inv_price NUMERIC(10,2)
);

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50),
  account_lastname VARCHAR(50),
  account_email VARCHAR(100) UNIQUE,
  account_password VARCHAR(255),
  account_type account_type DEFAULT 'Customer'
);


INSERT INTO classification (classification_name) VALUES
  ('Sport'),
  ('Pickup'),
  ('SUV'),
  ('Sedan');


INSERT INTO inventory (inv_make, inv_model, classification_id, inv_description, inv_image, inv_thumbnail, inv_price) VALUES
  ('MakeA', 'ModelX', 1, 'fast car', '/images/makea-modelx.jpg', '/images/makea-modelx-thumb.jpg', 25000.00),
  ('MakeB', 'ModelY', 1, 'sporty ride', '/images/makeb-modely.jpg', '/images/makeb-modely-thumb.jpg', 30000.00),
  ('GM', 'Hummer', 3, 'a truck with small interiors', '/images/gm-hummer.jpg', '/images/gm-hummer-thumb.jpg', 45000.00);


INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Sample', 'User', 'sample@example.com', 'password123');


UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');
