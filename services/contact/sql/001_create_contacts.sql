CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    location VARCHAR(120),
    message VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NUEVA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_status
    ON contacts(status);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at
    ON contacts(created_at DESC);