-- Add email_verified to users if missing (added after initial Railway deploy)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- Add is_verified to company_pages if missing
ALTER TABLE company_pages ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Add profile_photo_url to users if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add image_url to posts if missing
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;
