-- ============================================================================
-- Platform schema: shared tables for multitenancy management
-- Run once to initialize the database.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS platform;

-- Organizations (tenants) ---------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    schema_name TEXT NOT NULL UNIQUE,
    plan        TEXT NOT NULL DEFAULT 'trial',
    status      TEXT NOT NULL DEFAULT 'active',
    settings    JSONB DEFAULT '{}',
    group_id    UUID REFERENCES platform.organizations(id),
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- User <-> Organization memberships -----------------------------------------
CREATE TABLE IF NOT EXISTS platform.memberships (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'receptionist',
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, organization_id)
);

-- Pending invitations -------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform.invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'receptionist',
    token           TEXT NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON platform.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON platform.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON platform.memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON platform.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON platform.invitations(email);

-- RLS (platform tables are accessed via service_role, but enable for safety)
ALTER TABLE platform.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.invitations ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS; these policies let authenticated users read
-- their own memberships.
CREATE POLICY "Users can read own memberships"
    ON platform.memberships FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can read orgs they belong to"
    ON platform.organizations FOR SELECT
    USING (
        id IN (
            SELECT organization_id FROM platform.memberships
            WHERE user_id = auth.uid()
        )
    );
