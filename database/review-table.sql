-- Review table for vehicle reviews
-- Run this SQL in Render PostgreSQL console

CREATE TABLE IF NOT EXISTS review (
  review_id SERIAL PRIMARY KEY,
  review_text TEXT NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  inv_id INTEGER NOT NULL REFERENCES inventory(inv_id) ON DELETE CASCADE,
  account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_review_inv_id ON review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON review(account_id);
