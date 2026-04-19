# Déploiement sur Vercel

Ce guide décrit comment déployer **Logepro** (Next.js 16 + Supabase, multi-tenant par sous-domaine) sur [Vercel](https://vercel.com).

---

## 1. Prérequis

- Un compte Vercel lié à ton compte GitHub.
- Le repo `logepro` poussé sur GitHub.
- Un projet **Supabase** actif avec les migrations du dossier `sql/` appliquées.
- Un domaine racine disponible (ex. `logepro.app` ou `logepro.aspire.site`).
- Un accès à ton fournisseur **DNS** pour créer les enregistrements.

---

## 2. Créer le projet Vercel

1. Sur https://vercel.com/new, importer le repo GitHub `logepro`.
2. Framework Preset : **Next.js** (détecté automatiquement).
3. Root Directory : `.` (racine du repo).
4. Build Command : `npm run build` (par défaut).
5. Output : laisser Vercel gérer (`.next`).
6. Install Command : `npm install`.
7. **Ne pas déployer tout de suite** — configurer d'abord les variables d'environnement.

---

## 3. Variables d'environnement

Dans **Project Settings → Environment Variables**, ajouter pour les 3 environnements (Production, Preview, Development) :

| Variable | Valeur | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Project URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **Secret** — jamais exposé côté client |
| `NEXT_PUBLIC_APP_DOMAIN` | `logepro.app` (ou `logepro.aspire.site`) | Domaine racine utilisé par `proxy.ts` |
| `NEXT_PUBLIC_PROTOCOL` | `https` | `http` en dev uniquement |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` doit être marquée **Sensitive**. Ne pas la préfixer `NEXT_PUBLIC_`.

---

## 4. Premier déploiement

Cliquer sur **Deploy**. Vercel va :

1. Installer les dépendances.
2. Lancer `npm run build`.
3. Publier sur une URL du type `logepro-xxxx.vercel.app`.

Vérifier que la page d'accueil s'affiche. À ce stade le multi-tenant **ne fonctionne pas encore** car l'URL `*.vercel.app` ne correspond pas à `NEXT_PUBLIC_APP_DOMAIN`.

---

## 5. Brancher le domaine principal

Dans **Project Settings → Domains** :

1. Ajouter `logepro.app` (le domaine racine).
2. Vercel propose soit de transférer les nameservers, soit d'ajouter des enregistrements :
   - `A` sur `@` vers `76.76.21.21`
   - ou `CNAME` sur le root selon ton DNS (ALIAS/ANAME si dispo).
3. Attendre la propagation DNS + l'émission du certificat TLS.

### Cas `logepro.aspire.site` (sous-domaine d'un domaine tiers)

Si tu déploies sous `logepro.aspire.site` :

1. Ajouter `logepro.aspire.site` comme domaine dans Vercel.
2. Chez le gestionnaire de `aspire.site`, créer un `CNAME` :
   - `logepro.aspire.site` → `cname.vercel-dns.com`

---

## 6. Wildcard pour les sous-domaines tenants

Le middleware `proxy.ts` attend des URLs du type `hotel-marlin.<APP_DOMAIN>`. Il faut donc un wildcard.

### Ajouter le wildcard dans Vercel

Dans **Project Settings → Domains**, ajouter :

- `*.logepro.app` (ou `*.logepro.aspire.site`)

### Configurer le DNS

| Type | Nom | Valeur |
|---|---|---|
| `CNAME` | `*` (ou `*.logepro` pour aspire.site) | `cname.vercel-dns.com` |

> Certains fournisseurs DNS ne supportent pas les wildcards CNAME sur un sous-domaine (`*.logepro.aspire.site`). Vérifier chez le registrar ; sinon utiliser Cloudflare en proxy.

### Certificat TLS wildcard

Vercel émet automatiquement un certificat **Let's Encrypt wildcard** dès que :

- Le domaine wildcard est vérifié côté DNS.
- Tu peux prouver le contrôle du domaine (challenge DNS automatique si les nameservers sont chez Vercel, sinon TXT à ajouter).

Attendre l'icône verte ✅ à côté de `*.logepro.app` dans le dashboard Domains.

---

## 7. Vérifier le multi-tenant

Une fois les domaines verts :

- `https://logepro.app` → landing / onboarding (pas de slug).
- `https://app.logepro.app` → plateforme (subdomain spécial, ignoré par `proxy.ts`).
- `https://hotel-marlin.logepro.app` → résolu via `platform.organizations` → espace tenant.

Si un tenant inexistant est saisi, redirection vers `https://logepro.app/404` (comportement attendu de `proxy.ts`).

---

## 8. Configurer Supabase pour le domaine

Dans **Supabase → Authentication → URL Configuration** :

- **Site URL** : `https://logepro.app`
- **Redirect URLs** (ajouter toutes les variantes utilisées) :
  - `https://logepro.app/auth/callback`
  - `https://*.logepro.app/auth/callback`
  - `https://logepro-*-<team>.vercel.app/auth/callback` (previews, optionnel)

Sans ça, le flow OAuth / magic link échouera après déploiement.

---

## 9. Previews & branches

- Chaque Pull Request crée un déploiement Preview (`logepro-git-<branche>-<team>.vercel.app`).
- Les variables d'env `Preview` sont utilisées. Tu peux pointer les previews vers un **projet Supabase de staging** distinct.
- Le multi-tenant ne fonctionne pas sur les URLs `*.vercel.app` (pas de wildcard custom) : utiliser `?tenant=<slug>` pour tester.

---

## 10. Checklist post-déploiement

- [ ] `https://logepro.app` charge la landing.
- [ ] `https://<tenant>.logepro.app` charge l'espace tenant après login.
- [ ] Le login Supabase redirige correctement (pas d'erreur `redirect_uri`).
- [ ] Les routes API `/api/...` reçoivent bien les headers `x-tenant-id` et `x-tenant-schema`.
- [ ] Le 404 s'affiche pour un slug inconnu.
- [ ] Les webhooks Supabase (si utilisés) pointent vers `https://logepro.app/api/webhooks/...`.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` **n'apparaît pas** dans le bundle client (vérifier l'onglet Network du navigateur).

---

## 11. Commandes utiles

```bash
# Linter + typecheck avant push
npm run lint
npm run typecheck

# Déploiement manuel via CLI Vercel
npx vercel --prod
```

---

## Dépannage

- **Certificat wildcard bloqué** : vérifier qu'aucun enregistrement `CAA` ne bloque Let's Encrypt sur le domaine parent.
- **Tenant traité comme domaine principal** : vérifier que `NEXT_PUBLIC_APP_DOMAIN` correspond **exactement** au hostname servi (sans `www`, sans port).
- **Session perdue entre sous-domaines** : vérifier que le cookie Supabase est scopé sur `.logepro.app` (voir `lib/supabase/middleware.ts`).
- **Build échoue sur Vercel mais OK en local** : s'assurer que `SUPABASE_SERVICE_ROLE_KEY` n'est pas lue au build côté client (uniquement côté server / route handlers).
