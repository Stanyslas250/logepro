# PRD — LogePro
**Product Requirements Document**
Version 1.0 — Avril 2026
Statut : Brouillon

---

## 1. Résumé exécutif

LogePro est un logiciel SaaS tout-en-un de gestion d'établissements hôteliers (hôtels, motels, appartements meublés) conçu spécifiquement pour le marché gabonais. Il couvre la gestion interne (chambres, stock, personnel) et les réservations clients, avec une intégration native du mobile money local (Airtel Money, Moov Money).

**Problème résolu :** Les hôtels et motels gabonais (5 à 80 chambres) gèrent leur activité via Excel, cahiers papier ou des logiciels internationaux inadaptés, coûteux et sans support mobile money. Il n'existe pas de solution locale dédiée à ce segment.

**Proposition de valeur :** Un outil simple, abordable, en français, intégrant le mobile money, adapté aux contraintes locales (connexion intermittente, multi-utilisateurs, multi-sites).

---

## 2. Objectifs produit

| Objectif | Indicateur de succès | Horizon |
|---|---|---|
| Atteindre 10 clients payants | 10 abonnements actifs | Mois 4 |
| Atteindre 25 clients payants | 25 abonnements actifs | Mois 8 |
| Revenu mensuel récurrent > 1 M FCFA | MRR ≥ 1 000 000 FCFA | Mois 8 |
| Taux de rétention > 85% | Churn mensuel < 15% | Mois 6 |
| NPS ≥ 40 | Enquête trimestrielle | Mois 6 |

---

## 3. Utilisateurs cibles

### 3.1 Segment primaire
- **Petits établissements (5–20 chambres)** : motels, appartements meublés, pensions de famille à Libreville et Port-Gentil
- Gérants non-techniciens, souvent propriétaires de l'établissement
- Paiements majoritairement en cash et mobile money

### 3.2 Segment secondaire
- **Établissements moyens (20–80 chambres)** : hôtels locaux indépendants
- Direction avec du personnel dédié (réception, ménage)
- Besoin de reporting et de gestion multi-utilisateurs

### 3.3 Personas

**Persona 1 — Marcel, gérant de motel (segment primaire)**
- 45 ans, propriétaire d'un motel de 12 chambres à Libreville
- Utilise WhatsApp pour les réservations, un cahier pour la caisse
- Douleur principale : perte de réservations, erreurs de caisse, pas de visibilité sur son activité
- Disposition à payer : 20 000–30 000 FCFA/mois

**Persona 2 — Sandrine, directrice d'hôtel (segment secondaire)**
- 38 ans, dirige un hôtel de 45 chambres pour un propriétaire
- Utilise un tableur Excel partagé et un logiciel de facturation générique
- Douleur principale : coordination du personnel, suivi du stock, rapports pour le propriétaire
- Disposition à payer : 50 000–100 000 FCFA/mois

---

## 4. Périmètre fonctionnel

### 4.1 MVP — Phase 1 (Mois 1–2)

#### Module Réservations & Chambres
- Tableau de bord visuel des chambres (libre / occupé / en nettoyage / maintenance)
- Création, modification et annulation de réservations
- Fiche client (nom, téléphone, pièce d'identité)
- Calendrier des disponibilités (vue semaine / mois)
- Lien de réservation en ligne partageable (page publique simple)
- Confirmation de réservation par SMS et/ou WhatsApp

#### Module Caisse & Facturation
- Enregistrement des paiements (cash, Airtel Money, Moov Money, carte)
- Génération de reçus et factures PDF
- Rapport journalier de caisse (recettes, solde)
- Historique des transactions par chambre et par client

### 4.2 Phase 2 (Mois 3–4)

#### Module Stock & Consommables
- Catalogue des articles (linge, produits d'entretien, minibar, petit-déjeuner)
- Enregistrement des entrées et sorties de stock
- Alertes automatiques de réapprovisionnement (seuil configurable)
- Historique des mouvements par période

#### Module Tableau de bord & Rapports
- Taux d'occupation par période (jour, semaine, mois)
- Revenus par chambre, par type de paiement, par période
- Rapport d'activité exportable (PDF, Excel)
- Comparaison entre périodes

### 4.3 Phase 3 (Mois 5–6)

#### Module Personnel & Plannings
- Fiche employé (nom, rôle, contact)
- Planning hebdomadaire des équipes
- Enregistrement des présences / absences
- Assignation de tâches par chambre (ménage, maintenance)
- Suivi des tâches complétées en temps réel

### 4.4 Phase 4 (Mois 7+)

- Gestion multi-sites (un compte pour plusieurs établissements)
- Intégration Booking.com et Airbnb (synchronisation calendriers via iCal)
- Application mobile native (React Native / Expo)
- API publique pour intégrations tierces
- Module restaurant (commandes, tables) pour les hôtels avec restaurant

---

## 5. Exigences non fonctionnelles

| Exigence | Cible |
|---|---|
| Disponibilité | 99,5% uptime mensuel |
| Performance | Chargement des pages < 2 secondes (3G) |
| Mode hors ligne | Lecture des données en cache, sync à la reconnexion |
| Sécurité | Authentification JWT, HTTPS obligatoire, données chiffrées |
| Multi-utilisateurs | Rôles : Admin, Réceptionniste, Ménage, Comptable |
| Multi-établissements | Isolation stricte des données par établissement |
| Langue | Français uniquement (v1) |
| Compatibilité | Chrome, Firefox, Safari — desktop et mobile |
| PWA | Installable sur Android sans Play Store |

---

## 6. Architecture technique

### 6.1 Stack retenue

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | Next.js 14 (React) | SSR, routing intégré, PWA, déploiement Vercel |
| UI | shadcn/ui + Tailwind CSS | Composants prêts, gain de temps en solo |
| Backend / BDD | Supabase (PostgreSQL) | Auth, API REST, Realtime, Storage — tout-en-un |
| API custom | Next.js API Routes | Logique métier, rapports, webhooks paiement |
| Paiement | Fedapay | Airtel Money + Moov Money + cartes, CEMAC |
| SMS | Orange SMS API / Twilio | Confirmations et rappels |
| Emails | Resend | Emails transactionnels (factures, confirmations) |
| Hébergement | Vercel | CI/CD automatique depuis GitHub |
| Monitoring | Sentry + Vercel Analytics | Erreurs et performance |

### 6.2 Modèle de données (entités principales)

- **Organization** : établissement hôtelier (nom, type, adresse, plan)
- **User** : utilisateur avec rôle (admin, réceptionniste, ménage, comptable)
- **Room** : chambre (numéro, type, capacité, tarif, statut)
- **Guest** : client (nom, téléphone, pièce d'identité, historique)
- **Reservation** : réservation (chambre, client, dates, statut, source)
- **Payment** : paiement (montant, méthode, référence mobile money)
- **Invoice** : facture générée (PDF stocké sur Supabase Storage)
- **StockItem** : article en stock (nom, quantité, seuil d'alerte)
- **StockMovement** : mouvement de stock (entrée/sortie, date, utilisateur)
- **Employee** : employé (nom, rôle, planning)
- **Task** : tâche assignée (chambre, employé, type, statut, date)

---

## 7. Modèle de revenus

### 7.1 Plans tarifaires

| Plan | Prix mensuel | Cible | Inclus |
|---|---|---|---|
| **Starter** | 25 000 FCFA | Apparts, motels (≤ 10 chambres) | Réservations + Caisse |
| **Pro** | 55 000 FCFA | Hôtels locaux (10–50 chambres) | Tout inclus (stock, RH, rapports) |
| **Business** | 100 000 FCFA | Hôtels 50+ chambres, multi-sites | Pro + multi-sites + API + support prioritaire |

### 7.2 Projection MRR

| Jalons | Clients | Mix plan | MRR estimé |
|---|---|---|---|
| Mois 4 | 10 | 7 Starter + 3 Pro | ~340 000 FCFA |
| Mois 8 | 25 | 10 Starter + 12 Pro + 3 Business | ~1 085 000 FCFA |
| An 2 | 50 | 15 Starter + 25 Pro + 10 Business | ~2 550 000 FCFA |

### 7.3 Politique commerciale
- Période d'essai gratuite : 30 jours, sans carte bancaire
- Facturation mensuelle via mobile money ou virement
- Remise 2 mois offerts pour engagement annuel
- Programme de parrainage : 1 mois offert par client référé

---

## 8. Stratégie de lancement

### 8.1 Phase pilote (Mois 1–2)
- Recruter 3 établissements pilotes gratuitement (réseau personnel, associations hôtelières)
- Déploiement accompagné sur site
- Collecte de feedback hebdomadaire
- Objectif : valider les flux réservation + caisse en conditions réelles

### 8.2 Acquisition (Mois 3+)
- Démarchage direct des hôtels et motels de Libreville (Quartier Louis, PK5–PK12, Batterie IV)
- Présence dans les groupes WhatsApp professionnels du secteur hôtelier
- Partenariats avec experts-comptables et consultants PME locaux
- Contenu sur les réseaux sociaux (LinkedIn, Facebook) ciblant les gérants d'hôtels

### 8.3 Expansion géographique
- Libreville (lancement)
- Port-Gentil (Mois 8–10)
- Franceville, Oyem (An 2)

---

## 9. Risques & mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Faible adoption digitale des gérants | Moyenne | Élevé | Interface ultra-simple, formation sur site, support WhatsApp |
| Connexion internet instable | Élevée | Moyen | Mode PWA offline, sync différée |
| Concurrence d'un acteur international | Faible | Élevé | Ancrage local (FCFA, mobile money, français, support terrain) |
| Impayés / churn élevé | Moyenne | Moyen | Paiement mensuel mobile money, coupure automatique après 7j |
| Réglementation fiscale (DGI) | Faible | Moyen | Intégrer la conformité OHADA dès la facturation v1 |

---

## 10. Roadmap résumée

```
Mois 1–2   MVP : Réservations + Caisse
             └── 3 pilotes gratuits
Mois 3–4   Stock + Tableau de bord
             └── Passage en payant, cible 10 clients
Mois 5–6   Module RH + Personnel
             └── Prospection active, cible 25 clients
Mois 7–8   Multi-sites + Booking.com sync
             └── Extension Port-Gentil
Mois 9–12  App mobile native (React Native)
             └── Cible 50 clients, MRR > 2,5 M FCFA
```

---

## 11. Hors périmètre (v1)

- Gestion d'un restaurant indépendant (sans hébergement)
- Intégration OTA au-delà de iCal (Booking.com API directe)
- Application mobile native (remplacée par PWA en v1)
- Support multilingue (anglais, espagnol)
- Module de comptabilité complète (générer liasse fiscale)
- Paiement par carte bancaire physique (TPE connecté)

---

*Document maintenu par : Équipe LogePro*
*Prochaine révision : après retours des pilotes (fin Mois 2)*
