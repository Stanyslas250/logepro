-- ============================================================================
-- Apply a migration to ALL active tenant schemas.
-- Replace the inner block (-- MIGRATION SQL HERE) with actual migration SQL.
-- ============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT schema_name
        FROM platform.organizations
        WHERE status = 'active' AND schema_name IS NOT NULL
    LOOP
        EXECUTE format('SET search_path TO %I', r.schema_name);

        -- MIGRATION SQL HERE
        -- Example: ALTER TABLE rooms ADD COLUMN amenities JSONB DEFAULT '[]';

        RAISE NOTICE 'Applied migration to %', r.schema_name;
    END LOOP;

    -- Reset search_path
    SET search_path TO public;
END;
$$;
