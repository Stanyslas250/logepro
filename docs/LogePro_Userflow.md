# LogePro — Userflow
**Version 1.0 · Avril 2026**

---

## Sommaire

1. [Point d'entrée — Authentification](#1-point-dentrée--authentification)
2. [Réceptionniste](#2-réceptionniste)
   - 2.1 [Tableau de bord](#21-tableau-de-bord)
   - 2.2 [Créer une réservation](#22-créer-une-réservation)
   - 2.3 [Check-in](#23-check-in)
   - 2.4 [Check-out](#24-check-out)
   - 2.5 [Encaissement (Caisse)](#25-encaissement--caisse)
3. [Gérant (Admin)](#3-gérant-admin)
   - 3.1 [Tableau de bord](#31-tableau-de-bord)
   - 3.2 [Rapports & Exports](#32-rapports--exports)
   - 3.3 [Gestion du stock](#33-gestion-du-stock)
   - 3.4 [Gestion du personnel](#34-gestion-du-personnel)
4. [Flux partagés](#4-flux-partagés)
   - 4.1 [Paramètres de l'établissement](#41-paramètres-de-létablissement)
   - 4.2 [Lien de réservation public](#42-lien-de-réservation-public)
5. [Légende des statuts](#5-légende-des-statuts)

---

## 1. Point d'entrée — Authentification

```
[URL / App]
    │
    ▼
[Page de connexion]
    │  Email + Mot de passe
    ▼
[Vérification JWT]
    │
    ├─── Échec ──▶ [Message d'erreur] ──▶ Retour à la connexion
    │
    └─── Succès
            │
            ├─── Rôle : Réceptionniste ──▶ 2. Tableau de bord Réceptionniste
            ├─── Rôle : Gérant (Admin) ──▶ 3. Tableau de bord Gérant
            ├─── Rôle : Ménage         ──▶ [Liste des tâches assignées]
            └─── Rôle : Comptable      ──▶ [Module Caisse & Rapports]
```

---

## 2. Réceptionniste

### 2.1 Tableau de bord

**Entrée :** Connexion réussie avec le rôle Réceptionniste

**Contenu affiché :**
- Statut de toutes les chambres en temps réel (Libre / Occupée / Nettoyage / Maintenance)
- Compteurs : arrivées du jour, départs du jour, chambres disponibles
- Alertes urgentes (chambre en maintenance, réservation non confirmée)
- Accès rapide : Nouvelle réservation, Caisse, Calendrier

**Actions disponibles depuis le tableau de bord :**

| Action | Destination |
|---|---|
| Cliquer sur une chambre | Fiche chambre (détail + historique) |
| `+ Nouvelle réservation` | → 2.2 Créer une réservation |
| `Arrivées du jour` | → Liste des check-ins à effectuer |
| `Départs du jour` | → Liste des check-outs à effectuer |
| `Caisse` | → 2.5 Encaissement |

---

### 2.2 Créer une réservation

**Déclencheur :** Clic sur `+ Nouvelle réservation` ou demande client (téléphone, WhatsApp, comptoir)

```
[Formulaire de réservation]
    │
    ├── Étape 1 : Fiche client
    │       ├── Nom complet
    │       ├── Numéro de téléphone
    │       ├── Pièce d'identité (CNI / Passeport)
    │       └── [Client existant ?]
    │               ├── Oui ──▶ Recherche & sélection fiche existante
    │               └── Non ──▶ Création nouvelle fiche client
    │
    ├── Étape 2 : Sélection de la chambre
    │       ├── Vue calendrier des disponibilités
    │       ├── Filtres : type, capacité, tarif
    │       ├── Dates d'arrivée et de départ
    │       └── Calcul automatique du montant total
    │
    ├── Étape 3 : Confirmation
    │       ├── Récapitulatif : client, chambre, dates, montant
    │       ├── Acompte ? (optionnel)
    │       │       └── Oui ──▶ → 2.5 Encaissement (acompte)
    │       └── [Valider la réservation]
    │
    └── Résultat
            ├── Réservation créée → Statut : "Confirmée"
            ├── Chambre bloquée dans le calendrier
            └── Notification envoyée au client (SMS / WhatsApp)
```

**États possibles d'une réservation :**
- `En attente` → `Confirmée` → `En cours` (check-in effectué) → `Terminée` (check-out)
- `Confirmée` → `Annulée` (par le client ou le gérant)

---

### 2.3 Check-in

**Déclencheur :** Date d'arrivée atteinte / client présent au comptoir

```
[Liste des arrivées du jour]
    │
    └── Sélectionner le client
            │
            ├── Vérifier la pièce d'identité
            ├── Confirmer les dates et le tarif
            ├── Paiement à l'entrée ?
            │       └── Oui ──▶ → 2.5 Encaissement
            │
            └── [Confirmer le check-in]
                    │
                    ├── Statut chambre → "Occupée"
                    ├── Statut réservation → "En cours"
                    └── Fiche chambre mise à jour (client + date départ)
```

---

### 2.4 Check-out

**Déclencheur :** Date de départ atteinte / client souhaite partir

```
[Liste des départs du jour]
    │
    └── Sélectionner le client
            │
            ├── Afficher le récapitulatif : nuits, montant total, acomptes versés
            ├── Solde restant à payer ?
            │       └── Oui ──▶ → 2.5 Encaissement (solde)
            │
            ├── [Confirmer le check-out]
            │       ├── Statut chambre → "Nettoyage"
            │       ├── Statut réservation → "Terminée"
            │       └── Génération de la facture finale (PDF)
            │
            └── Envoi facture au client (WhatsApp / Email)
```

---

### 2.5 Encaissement — Caisse

**Déclencheur :** Acompte, solde check-out, ou paiement ponctuel

```
[Formulaire d'encaissement]
    │
    ├── Sélectionner le mode de paiement
    │       ├── Cash
    │       ├── Airtel Money  ──▶ Saisir la référence de transaction
    │       ├── Moov Money    ──▶ Saisir la référence de transaction
    │       └── Carte bancaire
    │
    ├── Saisir le montant
    │
    └── [Valider le paiement]
            │
            ├── Paiement enregistré dans l'historique des transactions
            ├── Mise à jour du solde de caisse journalier
            └── Génération du reçu (PDF téléchargeable / partageable WhatsApp)
```

---

## 3. Gérant (Admin)

### 3.1 Tableau de bord

**Entrée :** Connexion réussie avec le rôle Gérant

**Contenu affiché :**
- KPIs clés : taux d'occupation, revenu mensuel (MRR), nombre de réservations, NPS
- Graphique d'occupation sur les 7/30 derniers jours
- Répartition des revenus par mode de paiement (Cash, Airtel Money, Moov Money, Carte)
- Alertes stock (articles sous le seuil de réapprovisionnement)
- Activité récente du personnel

**Actions disponibles depuis le tableau de bord :**

| Action | Destination |
|---|---|
| `Rapports` | → 3.2 Rapports & Exports |
| `Stock` | → 3.3 Gestion du stock |
| `Personnel` | → 3.4 Gestion du personnel |
| `Paramètres` | → 4.1 Paramètres |
| `Réservations` | → Même flux que Réceptionniste |

---

### 3.2 Rapports & Exports

```
[Module Rapports]
    │
    ├── Sélectionner la période
    │       ├── Jour / Semaine / Mois
    │       └── Plage personnalisée
    │
    ├── Sélectionner les filtres
    │       ├── Par chambre ou type de chambre
    │       ├── Par mode de paiement
    │       └── Par source de réservation
    │
    ├── Visualiser les données
    │       ├── Taux d'occupation (%)
    │       ├── Revenus par chambre
    │       ├── Revenus par type de paiement
    │       └── Comparaison avec la période précédente
    │
    └── [Exporter]
            ├── PDF (rapport formaté)
            └── Excel (.xlsx, données brutes)
```

---

### 3.3 Gestion du stock

```
[Module Stock]
    │
    ├── Consulter le catalogue
    │       └── Articles : linge, produits d'entretien, minibar, petit-déjeuner
    │
    ├── Enregistrer un mouvement
    │       ├── Entrée de stock (livraison)
    │       │       ├── Sélectionner l'article
    │       │       ├── Saisir la quantité reçue
    │       │       └── Confirmer → Mise à jour du stock
    │       │
    │       └── Sortie de stock (consommation)
    │               ├── Sélectionner l'article
    │               ├── Saisir la quantité consommée
    │               └── Confirmer → Mise à jour du stock
    │
    ├── Alertes automatiques
    │       └── Quantité < Seuil configuré ──▶ Notification push / email au gérant
    │
    └── Historique des mouvements
            └── Filtrer par article, période, utilisateur
```

---

### 3.4 Gestion du personnel

```
[Module Personnel]
    │
    ├── Consulter les fiches employés
    │       └── Nom, rôle, contact, planning, absences
    │
    ├── Créer / modifier une fiche employé
    │       ├── Informations personnelles
    │       ├── Rôle (Réceptionniste / Ménage / Maintenance / Comptable)
    │       └── Accès au logiciel (oui / non)
    │
    ├── Planifier les équipes
    │       ├── Créer le planning hebdomadaire
    │       └── Assigner des créneaux (matin / après-midi / nuit)
    │
    ├── Assigner des tâches
    │       ├── Sélectionner la chambre cible
    │       ├── Sélectionner l'employé
    │       ├── Type de tâche : Nettoyage / Maintenance / Contrôle
    │       └── Priorité : Normale / Urgente
    │
    └── Suivi en temps réel
            ├── Tâche "En cours"
            ├── Tâche "Terminée" (validée par l'employé)
            └── Statut chambre mis à jour automatiquement
```

---

## 4. Flux partagés

### 4.1 Paramètres de l'établissement

**Accessible par :** Gérant uniquement

```
[Paramètres]
    │
    ├── Gestion des chambres
    │       ├── Ajouter / modifier / désactiver une chambre
    │       ├── Définir le type (Standard / Deluxe / Suite)
    │       └── Définir les tarifs (par nuit, par type)
    │
    ├── Gestion des utilisateurs
    │       ├── Inviter un nouvel utilisateur
    │       ├── Assigner un rôle
    │       └── Révoquer l'accès
    │
    ├── Notifications
    │       ├── Configurer les destinataires des alertes stock
    │       └── Activer / désactiver les confirmations SMS / WhatsApp
    │
    └── Facturation & Abonnement
            ├── Consulter le plan actuel (Starter / Pro / Business)
            └── Mettre à jour le mode de paiement de l'abonnement
```

---

### 4.2 Lien de réservation public

**Accessible par :** Gérant (génération du lien), Client final (réservation en ligne)

```
[Gérant génère le lien]
    │
    └── Lien partagé via WhatsApp / réseaux sociaux / site web
            │
            ▼
    [Page publique de réservation] (sans connexion)
            │
            ├── Étape 1 : Choisir les dates
            ├── Étape 2 : Voir les chambres disponibles
            ├── Étape 3 : Saisir ses coordonnées
            └── Étape 4 : Confirmer
                    │
                    ├── Réservation créée → Statut : "En attente"
                    ├── Notification au gérant / réceptionniste
                    └── SMS de confirmation envoyé au client
```

---

## 5. Légende des statuts

### Réservations

| Statut | Couleur | Description |
|---|---|---|
| En attente | 🟡 Ambre | Réservation créée, non encore validée |
| Confirmée | 🟢 Vert | Validée par la réception |
| En cours | 🔵 Bleu | Client présent (check-in effectué) |
| Terminée | ⚫ Gris | Check-out effectué, séjour clos |
| Annulée | 🔴 Rouge | Annulée par le client ou le gérant |

### Chambres

| Statut | Couleur | Description |
|---|---|---|
| Libre | 🟢 Vert clair | Disponible à la réservation |
| Occupée | 🔴 Rouge | Client en séjour |
| Nettoyage | 🟡 Ambre | En cours de remise en état |
| Maintenance | ⚫ Gris foncé | Hors service temporairement |

### Paiements

| Statut | Description |
|---|---|
| Payé | Transaction confirmée |
| En attente | Paiement mobile money en cours de vérification |
| Annulé | Transaction échouée ou remboursée |

---

*Document maintenu par : Équipe LogePro*
*Basé sur : PRD LogePro v1.0 · Avril 2026*
