-- Migration: Add settings and support tables to tenant schemas
-- Apply to all tenant schemas or include in provision-tenant.sql for new tenants

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
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- support_messages table (Realtime-enabled)
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('tenant', 'agent')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime for support_messages
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- support_appointments table
CREATE TABLE IF NOT EXISTS support_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheduled_at TIMESTAMPTZ NOT NULL,
    topic TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_room_categories_capacity ON room_categories(capacity);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_by ON support_tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_support_appointments_scheduled_at ON support_appointments(scheduled_at);

-- RLS Policies
ALTER TABLE hotel_floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_appointments ENABLE ROW LEVEL SECURITY;

-- Hotel floors policies
CREATE POLICY "Users can view hotel floors" ON hotel_floors
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert hotel floors" ON hotel_floors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update hotel floors" ON hotel_floors
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete hotel floors" ON hotel_floors
    FOR DELETE USING (auth.role() = 'authenticated');

-- Room categories policies
CREATE POLICY "Users can view room categories" ON room_categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage room categories" ON room_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Users can view services" ON services
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON support_tickets
    FOR SELECT USING (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own tickets" ON support_tickets
    FOR UPDATE USING (auth.role() = 'authenticated' AND created_by = auth.uid());

-- Support messages policies
CREATE POLICY "Users can view messages of their tickets" ON support_messages
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        ticket_id IN (
            SELECT id FROM support_tickets 
            WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their tickets" ON support_messages
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        ticket_id IN (
            SELECT id FROM support_tickets 
            WHERE created_by = auth.uid()
        )
    );

-- Support appointments policies
CREATE POLICY "Users can view their own appointments" ON support_appointments
    FOR SELECT USING (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can create appointments" ON support_appointments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own appointments" ON support_appointments
    FOR UPDATE USING (auth.role() = 'authenticated' AND created_by = auth.uid());

-- Function to generate unique ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
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
        SELECT EXISTS(SELECT 1 FROM support_tickets WHERE ticket_number = v_number) INTO v_exists;
        IF NOT v_exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN v_number;
END;
$$;

-- Trigger to auto-generate ticket number and update updated_at
CREATE OR REPLACE FUNCTION set_ticket_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER support_tickets_trigger
    BEFORE INSERT OR UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_metadata();
