-- ============================================================================
-- Tenant schema template
-- All occurrences of TENANT_SCHEMA will be replaced with the actual schema
-- name at provisioning time.
-- ============================================================================

-- Rooms ---------------------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.rooms (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number      TEXT NOT NULL,
    floor       INT NOT NULL DEFAULT 0,
    type        TEXT NOT NULL DEFAULT 'standard',
    capacity    INT NOT NULL DEFAULT 2,
    rate        INT NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'available',
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Guests --------------------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.guests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name   TEXT NOT NULL,
    phone       TEXT,
    email       TEXT,
    id_type     TEXT,
    id_number   TEXT,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Reservations --------------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.reservations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID NOT NULL REFERENCES TENANT_SCHEMA.rooms(id),
    guest_id        UUID NOT NULL REFERENCES TENANT_SCHEMA.guests(id),
    check_in        DATE NOT NULL,
    check_out       DATE NOT NULL,
    status          TEXT NOT NULL DEFAULT 'confirmed',
    source          TEXT DEFAULT 'direct',
    total_amount    INT NOT NULL,
    notes           TEXT,
    created_by      UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Payments ------------------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID REFERENCES TENANT_SCHEMA.reservations(id),
    amount          INT NOT NULL,
    method          TEXT NOT NULL,
    reference       TEXT,
    status          TEXT NOT NULL DEFAULT 'completed',
    received_by     UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Invoices ------------------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID REFERENCES TENANT_SCHEMA.reservations(id),
    invoice_number  TEXT NOT NULL,
    total_amount    INT NOT NULL,
    pdf_path        TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Stock items (Phase 2) ----------------------------------------------------
CREATE TABLE TENANT_SCHEMA.stock_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    category        TEXT,
    quantity        INT NOT NULL DEFAULT 0,
    alert_threshold INT DEFAULT 5,
    unit            TEXT DEFAULT 'unité',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Stock movements (Phase 2) ------------------------------------------------
CREATE TABLE TENANT_SCHEMA.stock_movements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id         UUID NOT NULL REFERENCES TENANT_SCHEMA.stock_items(id),
    type            TEXT NOT NULL,
    quantity        INT NOT NULL,
    reason          TEXT,
    performed_by    UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Employees (Phase 3) ------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.employees (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name   TEXT NOT NULL,
    role        TEXT NOT NULL,
    phone       TEXT,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tasks (Phase 3) ----------------------------------------------------------
CREATE TABLE TENANT_SCHEMA.tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID REFERENCES TENANT_SCHEMA.rooms(id),
    employee_id     UUID REFERENCES TENANT_SCHEMA.employees(id),
    type            TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending',
    due_date        DATE,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);
