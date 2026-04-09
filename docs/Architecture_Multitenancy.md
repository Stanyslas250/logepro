# Architecture Multitenancy — LogePro

**Document technique**
Version 1.0 — Avril 2026
Statut : Proposition

---

## 1. Vue d'ensemble

LogePro est un SaaS multitenant où chaque établissement hôtelier (tenant) accède à l'application via un sous-domaine dédié :

```
https://{slug}.logepro.app
```

Exemples :
- `hotel-marlin.logepro.app` → Hôtel Le Marlin (Libreville)
- `motel-pk8.logepro.app` → Motel PK8 (Libreville)
- `app.logepro.app` → Portail d'authentification / onboarding

L'isolation des données se fait via **une base de données séparée par tenant** (database-per-tenant), avec une base de données **plateforme** centrale pour l'authentification et le routage.

---

## 2. Stratégies de multitenancy — Comparatif

| Stratégie | Isolation | Coût | Complexité | Adapté LogePro ? |
|---|---|---|---|---|
| **A — Projets Supabase séparés** | Totale (projet distinct) | Élevé (~$25/mois/tenant) | Moyenne | Non (trop cher) |
| **B — Schémas PostgreSQL séparés** | Forte (schéma distinct) | Faible (1 seul projet) | Moyenne | **Oui ✓** |
| **C — RLS sur tables partagées** | Logique (même tables) | Très faible | Faible | Non (pas d'isolation réelle) |

### Recommandation : Stratégie B — Schema-per-Tenant

Un **seul projet Supabase** héberge toutes les données. Chaque tenant dispose de son propre **schéma PostgreSQL** au sein de la même base de données. Cela offre :

- **Isolation forte** : les tables de chaque tenant sont physiquement séparées
- **Coût maîtrisé** : un seul projet Supabase (plan Pro à ~$25/mois total)
- **Migrations uniformes** : un script de migration s'applique à tous les schémas
- **Backup/restore par tenant** : possible via `pg_dump --schema=tenant_xxx`
- **Conformité PRD** : "Isolation stricte des données par établissement"

---

## 3. Architecture cible

```
┌─────────────────────────────────────────────────────────┐
│                     VERCEL (Next.js)                     │
│                                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │  Middleware   │──▶│  App Router  │──▶│  API Routes  │  │
│  │  (subdomain)  │   │  (pages)     │   │  (logique)   │  │
│  └──────────────┘   └──────────────┘   └──────┬──────┘  │
│         │                                      │         │
└─────────┼──────────────────────────────────────┼─────────┘
          │                                      │
          ▼                                      ▼
┌─────────────────────────────────────────────────────────┐
│              SUPABASE (Projet unique)                     │
│                                                          │
│  ┌────────────────┐   ┌───────────────────────────────┐  │
│  │  Supabase Auth │   │     PostgreSQL                 │  │
│  │  (centralisé)  │   │                               │  │
│  │                │   │  ┌─────────┐  ┌─────────────┐ │  │
│  │  Tous les      │   │  │ platform│  │ tenant_xxx  │ │  │
│  │  utilisateurs  │   │  │ (public)│  │ (par tenant)│ │  │
│  │                │   │  └─────────┘  └─────────────┘ │  │
│  └────────────────┘   │                               │  │
│                       │  ┌─────────────┐              │  │
│  ┌────────────────┐   │  │ tenant_yyy  │              │  │
│  │    Storage      │   │  └─────────────┘              │  │
│  │  (par bucket    │   │                               │  │
│  │   /tenant)      │   │  ┌─────────────┐              │  │
│  └────────────────┘   │  │ tenant_zzz  │              │  │
│                       │  └─────────────┘              │  │
│                       └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Schéma `platform` (base commune)

Le schéma `platform` (ou `public`) gère les données transversales :

```sql
-- Table des organisations (tenants)
CREATE TABLE platform.organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,               -- "Hôtel Le Marlin"
    slug        TEXT NOT NULL UNIQUE,        -- "hotel-marlin" (sous-domaine)
    schema_name TEXT NOT NULL UNIQUE,        -- "tenant_hotel_marlin"
    plan        TEXT NOT NULL DEFAULT 'trial', -- trial | starter | pro | business
    status      TEXT NOT NULL DEFAULT 'active', -- active | suspended | archived
    settings    JSONB DEFAULT '{}',          -- config spécifique tenant
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Association utilisateur ↔ organisation
CREATE TABLE platform.memberships (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'receptionist',
    -- Rôles : owner | admin | receptionist | housekeeper | accountant
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, organization_id)
);

-- Invitations en attente
CREATE TABLE platform.invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'receptionist',
    token           TEXT NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Schéma `tenant_xxx` (par établissement)

Chaque tenant possède un schéma identique, créé automatiquement lors de l'onboarding.

```sql
-- Exemple : CREATE SCHEMA tenant_hotel_marlin;

-- Chambres
CREATE TABLE tenant_xxx.rooms (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number      TEXT NOT NULL,
    floor       INT NOT NULL DEFAULT 0,
    type        TEXT NOT NULL,  -- standard | suite | apartment
    capacity    INT NOT NULL DEFAULT 2,
    rate        INT NOT NULL,   -- tarif en FCFA
    status      TEXT NOT NULL DEFAULT 'available',
    -- available | occupied | cleaning | maintenance
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Clients
CREATE TABLE tenant_xxx.guests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       TEXT NOT NULL,
    phone           TEXT,
    email           TEXT,
    id_type         TEXT,        -- CNI | passport | permis
    id_number       TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Réservations
CREATE TABLE tenant_xxx.reservations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID NOT NULL REFERENCES tenant_xxx.rooms(id),
    guest_id        UUID NOT NULL REFERENCES tenant_xxx.guests(id),
    check_in        DATE NOT NULL,
    check_out       DATE NOT NULL,
    status          TEXT NOT NULL DEFAULT 'confirmed',
    -- pending | confirmed | checked_in | checked_out | cancelled
    source          TEXT DEFAULT 'direct', -- direct | online | booking | airbnb
    total_amount    INT NOT NULL,
    notes           TEXT,
    created_by      UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Paiements
CREATE TABLE tenant_xxx.payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID REFERENCES tenant_xxx.reservations(id),
    amount          INT NOT NULL,
    method          TEXT NOT NULL,   -- cash | airtel_money | moov_money | card
    reference       TEXT,            -- référence mobile money
    status          TEXT NOT NULL DEFAULT 'completed',
    received_by     UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Factures
CREATE TABLE tenant_xxx.invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID REFERENCES tenant_xxx.reservations(id),
    invoice_number  TEXT NOT NULL,
    total_amount    INT NOT NULL,
    pdf_path        TEXT,            -- chemin dans Supabase Storage
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Stock (Phase 2)
CREATE TABLE tenant_xxx.stock_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    category        TEXT,
    quantity        INT NOT NULL DEFAULT 0,
    alert_threshold INT DEFAULT 5,
    unit            TEXT DEFAULT 'unité',
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tenant_xxx.stock_movements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id         UUID NOT NULL REFERENCES tenant_xxx.stock_items(id),
    type            TEXT NOT NULL,  -- in | out
    quantity        INT NOT NULL,
    reason          TEXT,
    performed_by    UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Employés (Phase 3)
CREATE TABLE tenant_xxx.employees (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       TEXT NOT NULL,
    role            TEXT NOT NULL,
    phone           TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tenant_xxx.tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID REFERENCES tenant_xxx.rooms(id),
    employee_id     UUID REFERENCES tenant_xxx.employees(id),
    type            TEXT NOT NULL,  -- cleaning | maintenance | inspection
    status          TEXT NOT NULL DEFAULT 'pending',
    -- pending | in_progress | completed
    due_date        DATE,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Provisionnement d'un nouveau tenant

Lors de l'onboarding, une **fonction SQL** crée le schéma et les tables :

```sql
CREATE OR REPLACE FUNCTION platform.provision_tenant(
    p_org_id UUID,
    p_slug TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_schema TEXT;
BEGIN
    -- Générer le nom du schéma
    v_schema := 'tenant_' || REPLACE(p_slug, '-', '_');

    -- Créer le schéma
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);

    -- Appliquer le template de tables (via fichier SQL ou inline)
    EXECUTE format('
        CREATE TABLE %I.rooms (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            number TEXT NOT NULL,
            floor INT NOT NULL DEFAULT 0,
            type TEXT NOT NULL DEFAULT ''standard'',
            capacity INT NOT NULL DEFAULT 2,
            rate INT NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT ''available'',
            created_at TIMESTAMPTZ DEFAULT now()
        );
        -- ... (toutes les tables du schéma tenant)
    ', v_schema);

    -- Mettre à jour la référence dans platform
    UPDATE platform.organizations
    SET schema_name = v_schema, status = 'active'
    WHERE id = p_org_id;

    RETURN v_schema;
END;
$$;
```

---

## 7. Routage par sous-domaine (Next.js Middleware)

### 7.1 Configuration DNS

```
*.logepro.app  →  CNAME  →  cname.vercel-dns.com
```

Sur Vercel : configurer le **wildcard domain** `*.logepro.app`.

### 7.2 Middleware Next.js

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PLATFORM_DOMAIN = 'logepro.app';
const SPECIAL_SUBDOMAINS = ['app', 'www', 'api'];

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') ?? '';
    const subdomain = hostname.split('.')[0];

    // Domaine principal ou sous-domaines spéciaux → landing / auth
    if (
        hostname === PLATFORM_DOMAIN ||
        SPECIAL_SUBDOMAINS.includes(subdomain)
    ) {
        return NextResponse.next();
    }

    // Sous-domaine tenant → résoudre l'organisation
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: org } = await supabase
        .from('organizations')
        .select('id, schema_name, status')
        .eq('slug', subdomain)
        .single();

    if (!org || org.status !== 'active') {
        return NextResponse.redirect(new URL('https://logepro.app/404'));
    }

    // Injecter les headers tenant pour les API routes
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', org.id);
    response.headers.set('x-tenant-schema', org.schema_name);

    return response;
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api/webhooks).*)'],
};
```

### 7.3 Accès au schéma tenant côté serveur

```typescript
// lib/supabase/tenant.ts
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

export async function getTenantClient() {
    const headersList = await headers();
    const schema = headersList.get('x-tenant-schema');

    if (!schema) {
        throw new Error('Tenant non résolu');
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            db: { schema },
        }
    );
}
```

Usage dans un Server Component ou API Route :

```typescript
// app/dashboard/page.tsx (Server Component)
import { getTenantClient } from '@/lib/supabase/tenant';

export default async function DashboardPage() {
    const supabase = await getTenantClient();
    const { data: rooms } = await supabase.from('rooms').select('*');

    return <RoomGrid rooms={rooms} />;
}
```

---

## 8. Authentification

### 8.1 Flux d'authentification

```
1. Utilisateur va sur hotel-marlin.logepro.app
2. Middleware résout le tenant → injecte x-tenant-id / x-tenant-schema
3. Si non authentifié → redirect vers hotel-marlin.logepro.app/login
4. Login via Supabase Auth (email/password ou magic link)
5. Après auth → vérifier le membership dans platform.memberships
6. Si membership valide → accès au dashboard avec le bon schéma
7. Si pas de membership → page "accès refusé"
```

### 8.2 Rôles et permissions

| Rôle | Chambres | Réservations | Caisse | Stock | Personnel | Config |
|---|---|---|---|---|---|---|
| **owner** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **receptionist** | Lecture | ✅ | ✅ | ❌ | ❌ | ❌ |
| **housekeeper** | Statut | ❌ | ❌ | ❌ | Tâches | ❌ |
| **accountant** | Lecture | Lecture | ✅ | ✅ | Lecture | ❌ |

---

## 9. Gestion des migrations

Les migrations doivent s'appliquer à **tous les schémas tenant** de manière uniforme.

### 9.1 Stratégie

```
migrations/
├── platform/              # Migrations du schéma platform
│   ├── 001_initial.sql
│   └── 002_add_settings.sql
├── tenant/                # Template de migrations tenant
│   ├── 001_initial.sql    # Tables de base (rooms, guests, etc.)
│   ├── 002_stock.sql      # Phase 2 : stock
│   └── 003_personnel.sql  # Phase 3 : employés
└── apply_tenant_migrations.sql  # Script d'application à tous les tenants
```

### 9.2 Script d'application

```sql
-- Applique une migration à tous les schémas tenant
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT schema_name FROM platform.organizations WHERE status = 'active'
    LOOP
        EXECUTE format('SET search_path TO %I', r.schema_name);
        -- Exécuter la migration ici
    END LOOP;
END;
$$;
```

---

## 10. Storage (fichiers par tenant)

Supabase Storage organise les fichiers par tenant via des **préfixes de chemin** dans un bucket unique :

```
bucket: logepro-files
├── hotel-marlin/
│   ├── invoices/
│   │   └── 2026-04-001.pdf
│   └── id-documents/
│       └── guest-xxx.jpg
├── motel-pk8/
│   ├── invoices/
│   └── id-documents/
```

Politique de storage RLS :

```sql
CREATE POLICY "tenant_isolation" ON storage.objects
    USING (
        (storage.foldername(name))[1] = (
            SELECT slug FROM platform.organizations
            WHERE id = (
                SELECT organization_id FROM platform.memberships
                WHERE user_id = auth.uid()
                LIMIT 1
            )
        )
    );
```

---

## 11. Multi-sites (Phase 4)

Le PRD prévoit la gestion multi-sites pour le plan Business. Avec l'architecture schema-per-tenant :

**Option A — Un schéma par site :**
- `tenant_groupe_xyz_site1`, `tenant_groupe_xyz_site2`
- L'owner a des memberships dans chaque organisation
- Avantage : isolation totale entre sites

**Option B — Un schéma par groupe, avec colonne `site_id` :**
- Un seul schéma `tenant_groupe_xyz`
- Chaque table a une colonne `site_id`
- Avantage : rapports consolidés plus simples

**Recommandation :** Option A (un schéma par site) avec un concept de **groupe** dans `platform.organizations` :

```sql
ALTER TABLE platform.organizations
    ADD COLUMN group_id UUID REFERENCES platform.organizations(id);
```

---

## 12. Variables d'environnement requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_DOMAIN=logepro.app
NEXT_PUBLIC_PROTOCOL=https
```

---

## 13. Résumé de l'implémentation

| Étape | Description | Priorité |
|---|---|---|
| 1 | Créer le projet Supabase + configurer Auth | MVP |
| 2 | Créer le schéma `platform` (organizations, memberships) | MVP |
| 3 | Créer le template de schéma tenant + fonction de provisionnement | MVP |
| 4 | Implémenter le middleware Next.js (subdomain routing) | MVP |
| 5 | Créer `lib/supabase/` (client platform + client tenant) | MVP |
| 6 | Connecter le flux d'onboarding au provisionnement | MVP |
| 7 | Implémenter l'auth avec vérification de membership | MVP |
| 8 | Configurer le wildcard domain sur Vercel | MVP |
| 9 | Setup Storage avec isolation par tenant | Phase 2 |
| 10 | Pipeline de migrations multi-tenant | Phase 2 |
| 11 | Support multi-sites (groupes) | Phase 4 |

---

## 14. Considérations de développement local

En local, les sous-domaines ne fonctionnent pas nativement. Solutions :

1. **Fichier hosts** : ajouter `127.0.0.1 hotel-marlin.localhost` et utiliser `hotel-marlin.localhost:3000`
2. **Query param fallback** : en dev, accepter `?tenant=hotel-marlin` comme alternative au sous-domaine
3. **nip.io** : utiliser `hotel-marlin.127.0.0.1.nip.io:3000` (résout vers localhost)

Le middleware détectera l'environnement et s'adaptera :

```typescript
function extractTenantSlug(hostname: string): string | null {
    if (process.env.NODE_ENV === 'development') {
        // Support localhost subdomains: hotel-marlin.localhost:3000
        const parts = hostname.split('.');
        if (parts.length > 1 && parts[1].startsWith('localhost')) {
            return parts[0];
        }
    }
    // Production: hotel-marlin.logepro.app
    const parts = hostname.replace(`:${process.env.PORT || 3000}`, '').split('.');
    if (parts.length >= 3) return parts[0];
    return null;
}
```

---

*Document maintenu par : Équipe LogePro*
*À valider avant implémentation*
