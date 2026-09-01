CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    degree VARCHAR(100),
    college VARCHAR(255),
    district VARCHAR(100),
    skills TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS colleges (
    id SERIAL PRIMARY KEY,
    source_id INTEGER UNIQUE,
    college_name VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    district VARCHAR(255),
    city VARCHAR(255),
    address_line1 TEXT,
    address_line2 TEXT,
    pin_code VARCHAR(20),
    college_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS college_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    college_id VARCHAR(80) UNIQUE NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    institution_type VARCHAR(100),
    affiliation VARCHAR(255),
    authorized_person VARCHAR(255),
    mobile VARCHAR(20),
    address TEXT,
    website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE INDEX IF NOT EXISTS idx_students_email ON students (email);

CREATE INDEX IF NOT EXISTS idx_students_college ON students (college);

CREATE INDEX IF NOT EXISTS idx_students_district ON students (district);

CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges (college_name);

CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges (state);

CREATE INDEX IF NOT EXISTS idx_colleges_district ON colleges (district);

CREATE INDEX IF NOT EXISTS idx_college_profiles_college_id ON college_profiles (college_id);