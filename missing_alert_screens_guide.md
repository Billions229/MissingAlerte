# 📱 Guide Complet des Écrans - Missing Alert

## 🎯 Vue d'ensemble

Ce guide détaille tous les écrans de l'application Missing Alert, organisés par interface :
- **Application Mobile** (React Native + Expo)
- **Dashboard Web** (Next.js)
- **Panel Admin** (Next.js)

---

## 📱 APPLICATION MOBILE (React Native + Expo)

### 🔐 **Section Authentification**

#### 1. **Écran de Bienvenue** (`/welcome`)
- **Description** : Premier écran d'accueil de l'application
- **Contenu** :
  - Logo de l'application
  - Slogan motivant ("Ensemble, retrouvons nos proches")
  - Bouton "Commencer" pour démarrer l'inscription
  - Bouton "J'ai déjà un compte" pour se connecter
  - Sélecteur de langue (FR/EN)
- **Navigation** : Vers Login ou Registration

#### 2. **Écran de Connexion** (`/login`)
- **Description** : Authentification des utilisateurs existants
- **Contenu** :
  - Champ de saisie du numéro de téléphone
  - Sélecteur de code pays
  - Validation du format du numéro
  - Bouton "Envoyer le code"
  - Lien "Créer un compte"
  - Option "Continuer avec Google" (optionnel)
- **Navigation** : Vers OTP Verification ou Registration

#### 3. **Écran de Vérification OTP** (`/verify-otp`)
- **Description** : Vérification du code SMS reçu
- **Contenu** :
  - 6 champs pour saisir le code OTP
  - Numéro de téléphone masqué affiché
  - Timer de 60 secondes
  - Bouton "Renvoyer le code"
  - Bouton "Vérifier"
  - Lien "Modifier le numéro"
- **Navigation** : Vers Profile Setup ou Home (si profil existant)

#### 4. **Écran de Configuration du Profil** (`/profile-setup`)
- **Description** : Première configuration du profil utilisateur
- **Contenu** :
  - Photo de profil (optionnel)
  - Nom complet
  - Âge
  - Localisation (ville/région)
  - Rôle : Famille ou Bénévole
  - Consentement RGPD
  - Bouton "Créer mon profil"
- **Navigation** : Vers Home après création

---

### 🏠 **Section Principale (Tabs)**

#### 5. **Écran d'Accueil** (`/home` ou `/index`)
- **Description** : Page principale avec les alertes actives
- **Contenu** :
  - En-tête avec nom d'utilisateur et notifications
  - Bouton flottant "Créer une alerte"
  - Filtre par statut (Active, Résolue, Toutes)
  - Liste des alertes récentes :
    - Photo de la personne disparue
    - Nom et âge
    - Lieu et date de disparition
    - Statut avec badge coloré
    - Bouton "Voir détails"
  - Fonction Pull-to-refresh
  - Pagination avec scroll infini
- **Navigation** : Vers Alert Details, Create Alert, Profile

#### 6. **Écran Carte** (`/map`)
- **Description** : Visualisation géographique des alertes
- **Contenu** :
  - Carte interactive (Google Maps/MapBox)
  - Marqueurs pour chaque alerte :
    - Couleur selon le statut
    - Cluster pour les zones denses
  - Localisation de l'utilisateur
  - Contrôles de zoom
  - Bouton "Centrer sur moi"
  - Filtre par distance (5km, 10km, 25km, 50km)
  - Pop-up avec infos rapides au clic
- **Navigation** : Vers Alert Details via marqueurs

#### 7. **Écran Bénévoles** (`/volunteers`)
- **Description** : Espace dédié aux bénévoles
- **Contenu** :
  - Stats personnelles :
    - Nombre d'alertes suivies
    - Signalements effectués
    - Badge de niveau
  - Alertes à proximité
  - Bouton "Signaler une observation"
  - Historique des contributions
  - Leaderboard des bénévoles
  - Bouton "Devenir bénévole certifié"
- **Navigation** : Vers Sighting Report, Alert Details

#### 8. **Écran Profil** (`/profile`)
- **Description** : Profil utilisateur et paramètres
- **Contenu** :
  - Photo et informations personnelles
  - Mes alertes créées
  - Mes signalements (si bénévole)
  - Paramètres de notifications
  - Langue de l'application
  - Politique de confidentialité
  - Aide et support
  - Bouton "Déconnexion"
- **Navigation** : Vers Edit Profile, Settings, Help

---

### 🚨 **Section Alertes**

#### 9. **Écran de Création d'Alerte** (`/alert/create`)
- **Description** : Formulaire pour créer une nouvelle alerte
- **Contenu** :
  - **Étape 1 - Informations de base** :
    - Photo de la personne (obligatoire)
    - Nom complet
    - Âge
    - Sexe
    - Signes distinctifs
  - **Étape 2 - Circonstances** :
    - Date et heure de disparition
    - Lieu exact (avec carte)
    - Circonstances détaillées
    - Vêtements portés
  - **Étape 3 - Contact** :
    - Lien de parenté
    - Numéro de contact
    - Autorisation police
  - Bouton "Publier l'alerte"
  - Sauvegarde automatique en brouillon
- **Navigation** : Vers Home après publication

#### 10. **Écran Détails d'Alerte** (`/alert/[id]`)
- **Description** : Affichage complet d'une alerte
- **Contenu** :
  - Galerie de photos
  - Toutes les informations détaillées
  - Statut actuel avec timeline
  - Bouton "Signaler une observation"
  - Bouton "Partager"
  - Carte avec localisation
  - Commentaires et mises à jour
  - Contact famille (si autorisé)
- **Navigation** : Vers Sighting Report, Edit Alert (si propriétaire)

#### 11. **Écran d'Édition d'Alerte** (`/alert/edit/[id]`)
- **Description** : Modification d'une alerte existante
- **Contenu** :
  - Formulaire pré-rempli
  - Possibilité d'ajouter des photos
  - Mise à jour du statut
  - Ajout d'informations complémentaires
  - Bouton "Marquer comme résolue"
  - Historique des modifications
- **Navigation** : Vers Alert Details après modification

#### 12. **Écran de Signalement** (`/sighting/report`)
- **Description** : Formulaire pour signaler une observation
- **Contenu** :
  - Photo de la personne vue (optionnel)
  - Lieu exact de l'observation
  - Date et heure
  - Circonstances détaillées
  - Coordonnées du témoin
  - Bouton "Envoyer le signalement"
  - Possibilité de rester anonyme
- **Navigation** : Vers Alert Details après envoi

---

### 🔔 **Section Notifications**

#### 13. **Écran des Notifications** (`/notifications`)
- **Description** : Liste de toutes les notifications
- **Contenu** :
  - Notifications récentes
  - Icônes par type :
    - Nouvelle alerte à proximité
    - Mise à jour d'alerte suivie
    - Signalement sur mon alerte
    - Alerte résolue
  - Statut lu/non lu
  - Bouton "Marquer tout comme lu"
  - Filtre par type
- **Navigation** : Vers Alert Details via notifications

#### 14. **Écran Paramètres de Notifications** (`/notifications/settings`)
- **Description** : Configuration des notifications
- **Contenu** :
  - Notifications push activées/désactivées
  - Rayon de notification (5-50km)
  - Types de notifications :
    - Nouvelles alertes
    - Mises à jour
    - Signalements
  - Heures de réception
  - Notifications par email
- **Navigation** : Retour vers Profile

---

### ⚙️ **Section Paramètres**

#### 15. **Écran Paramètres** (`/settings`)
- **Description** : Configuration générale de l'application
- **Contenu** :
  - Profil utilisateur
  - Confidentialité
  - Notifications
  - Langue
  - Thème (clair/sombre)
  - Stockage et cache
  - Version de l'app
- **Navigation** : Vers sous-sections de paramètres

#### 16. **Écran Aide et Support** (`/help`)
- **Description** : Aide et support utilisateur
- **Contenu** :
  - FAQ par catégories
  - Tutoriels vidéo
  - Nous contacter
  - Signaler un bug
  - Demande de fonctionnalité
  - Conditions d'utilisation
- **Navigation** : Vers Contact, FAQ détaillée

---

## 🌐 DASHBOARD WEB FAMILLE (Next.js)

### 👨‍👩‍👧‍👦 **Section Famille**

#### 17. **Tableau de Bord Famille** (`/family/dashboard`)
- **Description** : Vue d'ensemble pour les familles
- **Contenu** :
  - Résumé des alertes actives
  - Derniers signalements reçus
  - Statistiques de visibilité
  - Graphiques d'engagement
  - Alertes à renouveler
  - Bouton "Créer une alerte"
  - Calendrier des événements
- **Navigation** : Vers toutes les sections famille

#### 18. **Gestion des Alertes Famille** (`/family/alerts`)
- **Description** : Gestion complète des alertes familiales
- **Contenu** :
  - Tableau des alertes créées
  - Statuts détaillés
  - Nombre de vues et partages
  - Signalements reçus
  - Actions : Modifier, Suspendre, Archiver
  - Bouton "Nouvelle alerte"
  - Filtre par statut et date
- **Navigation** : Vers Alert Details, Edit Alert

#### 19. **Signalements Reçus** (`/family/sightings`)
- **Description** : Tous les signalements pour les alertes familiales
- **Contenu** :
  - Liste chronologique des signalements
  - Détails de chaque observation
  - Statut de traitement
  - Coordonnées des témoins
  - Carte avec localisations
  - Bouton "Marquer comme traité"
  - Système de notation de fiabilité
- **Navigation** : Vers détails des signalements

#### 20. **Profil Famille** (`/family/profile`)
- **Description** : Gestion du profil familial
- **Contenu** :
  - Informations de contact
  - Historique des alertes
  - Paramètres de confidentialité
  - Notifications personnalisées
  - Membres de la famille autorisés
  - Bouton "Modifier le profil"
- **Navigation** : Vers Edit Profile

---

## 👨‍💼 PANEL ADMIN (Next.js)

### 📊 **Section Administration**

#### 21. **Tableau de Bord Admin** (`/admin/dashboard`)
- **Description** : Vue d'ensemble administrative
- **Contenu** :
  - Métriques clés :
    - Alertes actives/résolues
    - Nouveaux utilisateurs
    - Signalements du jour
    - Taux de résolution
  - Graphiques de tendances
  - Alertes nécessitant attention
  - Activité temps réel
  - Carte avec hotspots
- **Navigation** : Vers toutes les sections admin

#### 22. **Gestion des Alertes Admin** (`/admin/alerts`)
- **Description** : Administration complète des alertes
- **Contenu** :
  - Tableau de toutes les alertes
  - Filtres avancés :
    - Statut, date, localisation
    - Nombre de signalements
    - Fiabilité
  - Actions en lot
  - Modération de contenu
  - Escalade vers autorités
  - Bouton "Exporter les données"
- **Navigation** : Vers Alert Details, Moderation

#### 23. **Détails d'Alerte Admin** (`/admin/alerts/[id]`)
- **Description** : Vue administrative détaillée d'une alerte
- **Contenu** :
  - Toutes les informations
  - Historique complet
  - Signalements associés
  - Actions administratives :
    - Approuver/Rejeter
    - Escalader
    - Suspendre
    - Archiver
  - Logs d'activité
  - Communications avec la famille
- **Navigation** : Vers Actions, Communications

#### 24. **Gestion des Utilisateurs** (`/admin/users`)
- **Description** : Administration des comptes utilisateurs
- **Contenu** :
  - Liste de tous les utilisateurs
  - Filtres par rôle et statut
  - Statistiques d'activité
  - Actions : Suspendre, Bannir, Vérifier
  - Historique des actions
  - Signalements d'utilisateurs
  - Bouton "Exporter la liste"
- **Navigation** : Vers User Details, Moderation

#### 25. **Modération de Contenu** (`/admin/moderation`)
- **Description** : Outils de modération du contenu
- **Contenu** :
  - Queue de modération
  - Signalements automatiques
  - Contenu signalé par utilisateurs
  - Outils d'analyse d'images
  - Actions : Approuver, Rejeter, Escalader
  - Historique des décisions
  - Règles de modération
- **Navigation** : Vers Content Details, Rules

#### 26. **Analytiques Avancées** (`/admin/analytics`)
- **Description** : Analyses approfondies et rapports
- **Contenu** :
  - Tableaux de bord personnalisables
  - Métriques détaillées :
    - Taux de résolution par région
    - Temps de résolution moyen
    - Engagement des bénévoles
  - Graphiques interactifs
  - Rapports exportables
  - Comparaisons temporelles
- **Navigation** : Vers Reports, Exports

#### 27. **Gestion des Bénévoles** (`/admin/volunteers`)
- **Description** : Administration des bénévoles
- **Contenu** :
  - Liste des bénévoles actifs
  - Niveaux et certifications
  - Statistiques de contribution
  - Système de récompenses
  - Formation et certification
  - Bouton "Certifier un bénévole"
- **Navigation** : Vers Volunteer Details, Certification

#### 28. **Communications** (`/admin/communications`)
- **Description** : Gestion des communications
- **Contenu** :
  - Envoi de notifications en masse
  - Templates de messages
  - Campagnes de sensibilisation
  - Historique des communications
  - Métriques d'engagement
  - Bouton "Nouvelle campagne"
- **Navigation** : Vers Campaign Details, Templates

#### 29. **Paramètres Système** (`/admin/settings`)
- **Description** : Configuration système
- **Contenu** :
  - Paramètres généraux
  - Règles de modération
  - Intégrations externes
  - Sauvegardes
  - Logs système
  - Maintenance
- **Navigation** : Vers sous-sections de configuration

#### 30. **Rapports et Exports** (`/admin/reports`)
- **Description** : Génération de rapports
- **Contenu** :
  - Rapports prédéfinis
  - Générateur de rapports personnalisés
  - Exports planifiés
  - Historique des rapports
  - Formats disponibles (PDF, Excel, CSV)
  - Bouton "Nouveau rapport"
- **Navigation** : Vers Report Builder, Scheduled Reports

---

## 🔗 **Écrans Transversaux**

### 📱 **Écrans Communs Mobile**

#### 31. **Écran de Recherche** (`/search`)
- **Description** : Recherche globale dans l'application
- **Contenu** :
  - Barre de recherche avec filtres
  - Recherche par nom, lieu, âge
  - Historique des recherches
  - Résultats avec aperçu
  - Boutons de tri
- **Navigation** : Vers Alert Details

#### 32. **Écran de Partage** (`/share`)
- **Description** : Options de partage d'alertes
- **Contenu** :
  - Réseaux sociaux
  - Message SMS
  - Email
  - QR Code
  - Lien direct
  - Aperçu du contenu partagé
- **Navigation** : Vers plateformes externes

#### 33. **Écran Hors Ligne** (`/offline`)
- **Description** : Mode hors ligne
- **Contenu** :
  - Alertes en cache
  - Fonctionnalités limitées
  - Sync automatique
  - Statut de connexion
  - Bouton "Réessayer"
- **Navigation** : Sync vers état en ligne

---

### 🌐 **Écrans Communs Web**

#### 34. **Écran de Connexion Web** (`/login`)
- **Description** : Authentification pour le dashboard web
- **Contenu** :
  - Email/téléphone
  - Mot de passe
  - "Se souvenir de moi"
  - Lien "Mot de passe oublié"
  - Bouton "Se connecter"
- **Navigation** : Vers Dashboard selon le rôle

#### 35. **Écran d'Erreur 404** (`/404`)
- **Description** : Page non trouvée
- **Contenu** :
  - Message d'erreur clair
  - Liens de navigation
  - Bouton "Retour à l'accueil"
  - Recherche alternative
- **Navigation** : Vers pages principales

#### 36. **Écran de Maintenance** (`/maintenance`)
- **Description** : Mode maintenance
- **Contenu** :
  - Message de maintenance
  - Durée estimée
  - Informations de contact
  - Mises à jour en temps réel
- **Navigation** : Redirection automatique

---

## 📊 **Récapitulatif des Écrans**

### 📱 **Mobile App** : 24 écrans principaux
- **Authentification** : 4 écrans
- **Navigation principale** : 4 écrans (tabs)
- **Gestion d'alertes** : 4 écrans
- **Fonctionnalités** : 9 écrans
- **Utilitaires** : 3 écrans

### 🌐 **Dashboard Web** : 8 écrans
- **Famille** : 4 écrans
- **Authentification** : 1 écran
- **Utilitaires** : 3 écrans

### 👨‍💼 **Panel Admin** : 10 écrans
- **Administration** : 10 écrans spécialisés

### **Total** : **42 écrans uniques**

---

## 🎯 **Flux de Navigation Principaux**

### 1. **Flux d'Inscription**
`Welcome → Login → OTP → Profile Setup → Home`

### 2. **Flux de Création d'Alerte**
`Home → Create Alert → Alert Details → Share`

### 3. **Flux de Signalement**
`Map/Alert Details → Sighting Report → Confirmation`

### 4. **Flux Admin**
`Admin Login → Dashboard → Alerts → Moderation → Actions`

### 5. **Flux Famille**
`Family Login → Dashboard → Alerts → Sightings → Management`

---

## 📝 **Notes Techniques**

- **Responsive Design** : Tous les écrans web sont adaptatifs
- **Offline First** : L'app mobile fonctionne partiellement hors ligne
- **Real-time Updates** : Synchronisation en temps réel via Supabase
- **Accessibility** : Conformité aux standards d'accessibilité
- **Multi-language** : Support FR/EN sur tous les écrans