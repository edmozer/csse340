-- Favorite table for vehicle favorites

CREATE TABLE IF NOT EXISTS favorite (
  favorite_id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  inv_id INTEGER NOT NULL REFERENCES inventory(inv_id) ON DELETE CASCADE,
  favorite_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favorite_account_vehicle_unique UNIQUE (account_id, inv_id)
);
