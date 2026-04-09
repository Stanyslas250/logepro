-- ============================================================================
-- Function: platform.provision_tenant
-- Creates a new schema with all tenant tables for a given organization.
-- Must be SECURITY DEFINER in a non-exposed schema (platform).
-- ============================================================================

CREATE OR REPLACE FUNCTION platform.provision_tenant(
    p_org_id UUID,
    p_slug   TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_schema TEXT;
BEGIN
    v_schema := 'tenant_' || REPLACE(p_slug, '-', '_');

    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);

    -- rooms
    EXECUTE format('
        CREATE TABLE %I.rooms (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            number      TEXT NOT NULL,
            floor       INT NOT NULL DEFAULT 0,
            type        TEXT NOT NULL DEFAULT ''standard'',
            capacity    INT NOT NULL DEFAULT 2,
            rate        INT NOT NULL DEFAULT 0,
            status      TEXT NOT NULL DEFAULT ''available'',
            created_at  TIMESTAMPTZ DEFAULT now()
        )', v_schema);

    -- guests
    EXECUTE format('
        CREATE TABLE %I.guests (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            full_name   TEXT NOT NULL,
            phone       TEXT,
            email       TEXT,
            id_type     TEXT,
            id_number   TEXT,
            notes       TEXT,
            created_at  TIMESTAMPTZ DEFAULT now()
        )', v_schema);

    -- reservations
    EXECUTE format('
        CREATE TABLE %I.reservations (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            room_id         UUID NOT NULL REFERENCES %I.rooms(id),
            guest_id        UUID NOT NULL REFERENCES %I.guests(id),
            check_in        DATE NOT NULL,
            check_out       DATE NOT NULL,
            status          TEXT NOT NULL DEFAULT ''confirmed'',
            source          TEXT DEFAULT ''direct'',
            total_amount    INT NOT NULL,
            notes           TEXT,
            created_by      UUID REFERENCES auth.users(id),
            created_at      TIMESTAMPTZ DEFAULT now()
        )', v_schema, v_schema, v_schema);

    -- payments
    EXECUTE format('
        CREATE TABLE %I.payments (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            reservation_id  UUID REFERENCES %I.reservations(id),
            amount          INT NOT NULL,
            method          TEXT NOT NULL,
            reference       TEXT,
            status          TEXT NOT NULL DEFAULT ''completed'',
            received_by     UUID REFERENCES auth.users(id),
            created_at      TIMESTAMPTZ DEFAULT now()
        )', v_schema, v_schema);

    -- invoices
    EXECUTE format('
        CREATE TABLE %I.invoices (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            reservation_id  UUID REFERENCES %I.reservations(id),
            invoice_number  TEXT NOT NULL,
            total_amount    INT NOT NULL,
            pdf_path        TEXT,
            created_at      TIMESTAMPTZ DEFAULT now()
        )', v_schema, v_schema);

    -- stock_items
    EXECUTE format('
        CREATE TABLE %I.stock_items (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name            TEXT NOT NULL,
            category        TEXT,
            quantity        INT NOT NULL DEFAULT 0,
            alert_threshold INT DEFAULT 5,
            unit            TEXT DEFAULT ''unité'',
            created_at      TIMESTAMPTZ DEFAULT now()
        )', v_schema);

    -- stock_movements
    EXECUTE format('
        CREATE TABLE %I.stock_movements (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            item_id         UUID NOT NULL REFERENCES %I.stock_items(id),
            type            TEXT NOT NULL,
            quantity        INT NOT NULL,
            reason          TEXT,
            performed_by    UUID REFERENCES auth.users(id),
            created_at      TIMESTAMPTZ DEFAULT now()
        )', v_schema, v_schema);

    -- employees
    EXECUTE format('
        CREATE TABLE %I.employees (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            full_name   TEXT NOT NULL,
            role        TEXT NOT NULL,
            phone       TEXT,
            is_active   BOOLEAN DEFAULT true,
            created_at  TIMESTAMPTZ DEFAULT now()
        )', v_schema);

    -- tasks
    EXECUTE format('
        CREATE TABLE %I.tasks (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            room_id         UUID REFERENCES %I.rooms(id),
            employee_id     UUID REFERENCES %I.employees(id),
            type            TEXT NOT NULL,
            status          TEXT NOT NULL DEFAULT ''pending'',
            due_date        DATE,
            completed_at    TIMESTAMPTZ,
            created_at      TIMESTAMPTZ DEFAULT now()
        )', v_schema, v_schema, v_schema);

    -- Update org record
    UPDATE platform.organizations
    SET schema_name = v_schema, status = 'active', updated_at = now()
    WHERE id = p_org_id;

    RETURN v_schema;
END;
$$;
