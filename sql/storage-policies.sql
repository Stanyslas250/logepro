-- ============================================================================
-- Storage: bucket creation and RLS policies for tenant isolation
-- ============================================================================

-- Create the shared bucket (public = false for private access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logepro-files', 'logepro-files', false)
ON CONFLICT (id) DO NOTHING;

-- Tenant isolation: users can only access files under their org's slug prefix
CREATE POLICY "Tenant file isolation — SELECT"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'logepro-files'
        AND (storage.foldername(name))[1] = (
            SELECT o.slug FROM platform.organizations o
            INNER JOIN platform.memberships m ON m.organization_id = o.id
            WHERE m.user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Tenant file isolation — INSERT"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'logepro-files'
        AND (storage.foldername(name))[1] = (
            SELECT o.slug FROM platform.organizations o
            INNER JOIN platform.memberships m ON m.organization_id = o.id
            WHERE m.user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Tenant file isolation — UPDATE"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'logepro-files'
        AND (storage.foldername(name))[1] = (
            SELECT o.slug FROM platform.organizations o
            INNER JOIN platform.memberships m ON m.organization_id = o.id
            WHERE m.user_id = auth.uid()
            LIMIT 1
        )
    );

CREATE POLICY "Tenant file isolation — DELETE"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'logepro-files'
        AND (storage.foldername(name))[1] = (
            SELECT o.slug FROM platform.organizations o
            INNER JOIN platform.memberships m ON m.organization_id = o.id
            WHERE m.user_id = auth.uid()
            LIMIT 1
        )
    );
