-- GlowMuse Landing Page Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately if needed)
-- CREATE DATABASE glowmuse_leads;

-- Connect to the database and create tables

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    source VARCHAR(50) DEFAULT 'landing_page',
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW leads_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_leads,
    COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
    COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads
FROM leads 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Optional: Create a function to get daily stats
CREATE OR REPLACE FUNCTION get_daily_stats(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_leads BIGINT,
    pending_leads BIGINT,
    contacted_leads BIGINT,
    converted_leads BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_leads,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads
    FROM leads 
    WHERE DATE(created_at) = target_date;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
-- INSERT INTO leads (name, email, phone, ip_address) VALUES 
-- ('Maria Silva', 'maria@email.com', '(11) 99999-9999', '127.0.0.1'),
-- ('Ana Santos', 'ana@email.com', '(21) 88888-8888', '127.0.0.1');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON TABLE leads TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE leads_id_seq TO your_app_user;
