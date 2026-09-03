-- ================================================
-- Migration 004: Create company_profiles table
-- This table stores registered company accounts
-- Each company is linked to a user in the users table
-- ================================================

CREATE TABLE IF NOT EXISTS company_profiles (

    -- id: Auto-incrementing unique number for each company
    -- SERIAL means PostgreSQL will automatically give 1, 2, 3, 4...
    -- PRIMARY KEY means this is the main identifier for each row
    id SERIAL PRIMARY KEY,

    -- user_id: Links this company to a user in the "users" table
    -- This is how we connect login credentials (email/password) to company data
    -- ON DELETE CASCADE means: if the user is deleted, delete the company too
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    -- ========== SECTION 01: Company Information ==========

    -- Company's registered name (e.g., "Tata Consultancy Services")
    company_name VARCHAR(500) NOT NULL,

    -- Type of company (private, public, llp, partnership, startup, government, other)
    company_type VARCHAR(100) NOT NULL,

    -- Industry sector (it, finance, manufacturing, education, healthcare, etc.)
    industry VARCHAR(100) NOT NULL,

    -- Company's official website (e.g., "https://www.tcs.com")
    website VARCHAR(500),

    -- Company's official email - also stored in users table for login
    email VARCHAR(255) NOT NULL,

    -- ========== SECTION 02: Registered Office ==========

    -- Full address of the company's registered office
    office_address TEXT NOT NULL,

    -- State where the office is located
    state VARCHAR(100) NOT NULL,

    -- District where the office is located
    district VARCHAR(100) NOT NULL,

    -- 6-digit PIN code
    pincode VARCHAR(10) NOT NULL,

    -- ========== SECTION 03: Authorized Representative ==========

    -- Name of the person managing this account (e.g., "Rahul Sharma")
    representative_name VARCHAR(255) NOT NULL,

    -- Their job title (e.g., "HR Manager")
    designation VARCHAR(255) NOT NULL,

    -- Their 10-digit mobile number
    mobile VARCHAR(20) NOT NULL,

    -- Optional backup email
    alternate_email VARCHAR(255),

    -- ========== SECTION 04: Corporate Details ==========

    -- CIN (Corporate Identification Number) or Registration Number
    cin_number VARCHAR(100) NOT NULL,

    -- GST Number (optional - not all companies have it)
    gst_number VARCHAR(100),

    -- ========== Timestamps ==========

    -- When this record was created (auto-filled by PostgreSQL)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- When this record was last updated (auto-filled by PostgreSQL)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- INDEXES: Make searching faster
-- Think of indexes like a book's index page -
-- instead of reading every page, you jump directly to what you need
-- ================================================

-- Fast lookup when searching companies by name
CREATE INDEX IF NOT EXISTS idx_company_profiles_company_name
ON company_profiles(company_name);

-- Fast lookup when filtering companies by state
CREATE INDEX IF NOT EXISTS idx_company_profiles_state
ON company_profiles(state);

-- Fast lookup when filtering companies by district
CREATE INDEX IF NOT EXISTS idx_company_profiles_district
ON company_profiles(district);

-- Fast lookup when filtering companies by industry
CREATE INDEX IF NOT EXISTS idx_company_profiles_industry
ON company_profiles(industry);
