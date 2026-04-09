# Prochaines étapes — LogePro

Document de suivi court terme (aligné sur [LogePro_PRD.md](./LogePro_PRD.md), section roadmap Mois 1–2).

---

## 1. MVP — Réservations + Caisse (Mois 1–2)

Objectif : livrer le périmètre fonctionnel décrit au PRD (§4.1) pour les modules **Réservations & Chambres** et **Caisse & Facturation**.

### 1.1 Réservations & chambres

- Tableau de bord visuel des chambres (libre / occupé / en nettoyage / maintenance)
- CRUD réservations (création, modification, annulation)
- Fiche client (nom, téléphone, pièce d’identité)
- Calendrier des disponibilités (vue semaine / mois)
- Page publique de réservation en ligne partageable (lien simple)
- Confirmation de réservation par SMS et/ou WhatsApp (selon intégration disponible)

### 1.2 Caisse & facturation

- Enregistrement des paiements (cash, Airtel Money, Moov Money, carte)
- Génération de reçus et factures PDF
- Rapport journalier de caisse (recettes, solde)
- Historique des transactions par chambre et par client

### 1.3 Programme pilote — 3 établissements gratuits

- Recruter et onboarder **3 pilotes** (PRD §8.1)
- Déploiement accompagné, collecte de feedback hebdomadaire
- Valider les flux réservation + caisse en conditions réelles

---

## 2. Revue design — `app/(tenant)`

Passage côté **interface tenant** (dashboard, chambres, navigation, états vides, responsive) :

- Cohérence visuelle (typographie, espacements, composants shadcn/ui + Tailwind)
- Parcours critiques : accueil tableau de bord, vue chambres, futures réservations / caisse
- Accessibilité et lisibilité sur mobile (cible PWA / usage terrain)

Fichiers actuels à prendre comme base : `app/(tenant)/layout.tsx`, `dashboard/page.tsx`, `rooms/page.tsx`.

---

## 3. Back-office plateforme — `app/admin`

Implémenter les pages dédiées (au-delà de la page admin actuelle) :

| Page | Contenu attendu (à préciser au fil de l’implémentation) |
|------|--------------------------------------------------------|
| **Gestion hôtels** | Liste des établissements / tenants, statut, actions (provision, suspension, etc.) |
| **Abonnements** | Plans, statut d’abonnement, essais, facturation côté plateforme |
| **Analytiques** | Indicateurs agrégés (inscriptions, usage, revenus MRR si applicable) |
| **Logs système** | Événements techniques ou métier (audit, erreurs, actions admin) |

Navigation : intégrer ces entrées dans `app/admin/layout.tsx` (ou structure de routes `/admin/...` dédiée).

---

## 4. Fonctions transverses (toutes zones ou tenant)

À planifier en parallèle ou juste après le socle MVP :

| Élément | Description |
|---------|-------------|
| **Système de notifications** | Centre de notifications (in-app), préférences, canaux pertinents (email / push PWA plus tard) |
| **Paramètres (Settings)** | Page ou section réglages établissement / compte utilisateur |
| **Profil** | Page profil utilisateur (identité, mot de passe, préférences) |
| **Enregistrer un hôtel** | Parcours d’inscription / création d’établissement (onboarding ou formulaire dédié selon le flux actuel `onboarding`) |

---

## 5. Ordre de travail suggéré

1. Finaliser le **MVP réservations + caisse** (données + API + écrans tenant).
2. **Revue design** `app/(tenant)` une fois les écrans principaux stabilisés.
3. Découper les **routes admin** (4 pages) + modèle de données / RLS nécessaire.
4. Brancher **notifications**, **settings**, **profil** et **enregistrement hôtel** en s’appuyant sur l’auth et le multi-tenant existants.

---

*Dernière mise à jour : avril 2026*
