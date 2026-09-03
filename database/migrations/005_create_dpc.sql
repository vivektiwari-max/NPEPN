CREATE TABLE IF NOT EXISTS district_placement_cells (
    id SERIAL PRIMARY KEY,
    dpc_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    official_email VARCHAR(255) UNIQUE NOT NULL,
    official_mobile VARCHAR(20) NOT NULL,
    landline VARCHAR(20),
    website VARCHAR(255),
    officer_name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    officer_email VARCHAR(255) NOT NULL,
    officer_mobile VARCHAR(20) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
