-- ============================================================================
-- Apply settings & support tables to tenant_yarden schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================================

SET search_path TO tenant_yarden;

-- hotel_floors table
CREATE TABLE IF NOT EXISTS hotel_floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    floor_number INT NOT NULL UNIQUE,
    room_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- room_categories table
CREATE TABLE IF NOT EXISTS room_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subtitle TEXT,
    status_label TEXT NOT NULL DEFAULT 'Standard',
    base_rate INT NOT NULL DEFAULT 0,
    capacity INT NOT NULL DEFAULT 2,
    room_numbers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('wellness', 'logistics', 'gastronomy')),
    description TEXT NOT NULL,
    price_label TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    ticket_number TEXT NOT NULL UNIQUE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tenant_yarden.support_tickets(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('tenant', 'agent')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- support_appointments table
CREATE TABLE IF NOT EXISTS support_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheduled_at TIMESTAMPTZ NOT NULL,
    topic TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_room_categories_capacity ON room_categories(capacity);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_by ON support_tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_support_appointments_scheduled_at ON support_appointments(scheduled_at);

-- Function to generate unique ticket numbers
CREATE OR REPLACE FUNCTION tenant_yarden.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_number TEXT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_number := 'AV-' || to_char(now(), 'YYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
        SELECT EXISTS(SELECT 1 FROM tenant_yarden.support_tickets WHERE ticket_number = v_number) INTO v_exists;
        IF NOT v_exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN v_number;
END;
$$;

-- Trigger to auto-generate ticket number and update updated_at
CREATE OR REPLACE FUNCTION tenant_yarden.set_ticket_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := tenant_yarden.generate_ticket_number();
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS support_tickets_trigger ON tenant_yarden.support_tickets;
CREATE TRIGGER support_tickets_trigger
    BEFORE INSERT OR UPDATE ON tenant_yarden.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION tenant_yarden.set_ticket_metadata();

-- API access (required for supabase-js db.schema / PostgREST; run after manual DDL if provision_tenant grants were missing)
GRANT USAGE ON SCHEMA tenant_yarden TO authenticator, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA tenant_yarden TO authenticator, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tenant_yarden TO authenticator, anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA tenant_yarden TO authenticator, anon, authenticated, service_role;

-- Reset search_path
SET search_path TO public;

SELECT 'Migration applied successfully to tenant_yarden' AS result;
