-- ============================================================================
-- Platform admins: users with global admin access to the platform dashboard
-- Run once after platform-schema.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS platform.platform_admins (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_admins_user ON platform.platform_admins(user_id);

ALTER TABLE platform.platform_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own record"
    ON platform.platform_admins FOR SELECT
    USING (user_id = auth.uid());
