# Logepro

Application web de gestion hôtelière (réservations, chambres, clients, support, paramètres) pour les établissements, avec authentification [Supabase](https://supabase.com) et isolation des données par locataire (multi-tenant).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), [React](https://react.dev) 19, [Turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack) en dev
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) 4, [shadcn/ui](https://ui.shadcn.com) (composants dans `components/ui`)
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)

## Prérequis

- Node.js (version compatible avec Next.js 16)
- Un projet Supabase configuré (URL, clés API, schéma / migrations dans `sql/`)

## Installation

```bash
npm install
```

Créez un fichier `.env.local` à la racine (voir ci-dessous).

## Variables d’environnement

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme (client / SSR) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (routes admin, provisioning, opérations serveur sensibles) |
| `NEXT_PUBLIC_APP_DOMAIN` | Domaine de l’app (défaut : `logepro.app`) — utilisé pour les redirections et les sous-domaines locataires |
| `NEXT_PUBLIC_PROTOCOL` | `http` ou `https` (défaut : `https`) |

Ne commitez pas `.env.local` ni les clés secrètes.

## Développement local

```bash
npm run dev
```

L’app applique le **multi-tenant par sous-domaine** : en production, un locataire correspond à un sous-domaine du type `mon-hotel.<domaine>`. En développement, vous pouvez utiliser un sous-domaine devant `localhost` (par ex. `hotel-marlin.localhost:3000`) ou le paramètre d’URL `?tenant=<slug>` selon la configuration du middleware (`proxy.ts`).

## Scripts

| Commande | Description |
|----------|----------------|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Démarrage du build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier sur les fichiers `.ts` / `.tsx` |
| `npm run typecheck` | Vérification TypeScript (`tsc --noEmit`) |

## Organisation du dépôt (aperçu)

- `app/` — pages et routes API (zone locataire `(tenant)`, auth, onboarding, admin, landing)
- `components/` — UI métier et layout
- `lib/` — clients Supabase, auth, utilitaires
- `sql/` — scripts SQL de provisionnement et migrations

## Composants UI (shadcn)

Pour ajouter un composant shadcn :

```bash
npx shadcn@latest add button
```

Import typique :

```tsx
import { Button } from "@/components/ui/button"
```
