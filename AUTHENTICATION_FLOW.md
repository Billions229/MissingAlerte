# Flux d'Authentification Missing Alert

## 🔐 Vue d'ensemble

L'application Missing Alert utilise un système d'authentification basé sur les numéros de téléphone avec vérification OTP (One-Time Password) via Supabase et TextBee SMS.

## 📱 Écrans Implémentés

### 1. Écran d'Accueil (`/welcome`)
- **Fichier** : `app/welcome.tsx`
- **Fonctionnalités** :
  - Présentation de l'application
  - Bouton "Commencer" → redirige vers l'inscription
  - Lien "Se connecter" → redirige vers la connexion

### 2. Écran d'Inscription (`/signup`)
- **Fichier** : `app/signup.tsx`
- **Fonctionnalités** :
  - Saisie du nom complet
  - Saisie du numéro de téléphone avec sélecteur de pays
  - Choix du type d'utilisateur (Famille/Bénévole)
  - Validation des données
  - Envoi d'OTP via Supabase Auth
  - Navigation vers vérification OTP

### 3. Écran de Connexion (`/login`)
- **Fichier** : `app/login.tsx`
- **Fonctionnalités** :
  - Saisie du numéro de téléphone
  - Validation du format
  - Envoi d'OTP via Supabase Auth
  - Navigation vers vérification OTP

### 4. Écran de Vérification OTP (`/verify-otp`)
- **Fichier** : `app/verify-otp.tsx`
- **Fonctionnalités** :
  - Saisie du code à 6 chiffres
  - Auto-focus et auto-advance
  - Timer de 60 secondes
  - Fonction de renvoi de code
  - Vérification via Supabase Auth
  - Création/mise à jour du profil utilisateur
  - Navigation vers l'application principale

## 🔧 Services Implémentés

### Service d'Authentification (`services/auth.ts`)

#### Méthodes principales :
- `sendOTP(params)` : Envoie un code OTP via Supabase
- `verifyOTP(params)` : Vérifie le code OTP
- `createProfile(params)` : Crée un profil utilisateur
- `getProfile(userId)` : Récupère un profil utilisateur
- `updateProfile(userId, updates)` : Met à jour un profil
- `signOut()` : Déconnecte l'utilisateur
- `getSession()` : Récupère la session actuelle
- `getCurrentUser()` : Récupère l'utilisateur actuel
- `hasCompletedProfile(userId)` : Vérifie si le profil est complet

### Service SMS (`services/sms.ts`)

#### Méthodes principales :
- `sendSMS(params)` : Envoie un SMS via TextBee
- `sendOTP(params)` : Envoie un code OTP par SMS
- `generateOTPCode(length)` : Génère un code OTP aléatoire
- `validatePhoneNumber(phone)` : Valide le format du numéro
- `formatPhoneNumber(phone)` : Formate le numéro de téléphone
- `checkServiceStatus()` : Vérifie le statut du service SMS

### Client Supabase (`lib/supabase.ts`)

#### Configuration :
- Client Supabase avec AsyncStorage pour la persistance
- Types TypeScript pour la base de données
- Auto-refresh des tokens d'authentification

## 🗄️ Base de Données

### Tables principales :

#### `profiles`
```sql
- id (UUID, référence auth.users)
- phone_number (TEXT, unique)
- full_name (TEXT)
- avatar_url (TEXT)
- user_type (ENUM: 'family', 'volunteer')
- is_verified (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### `missing_persons`
```sql
- id (UUID, primary key)
- reporter_id (UUID, référence profiles)
- full_name (TEXT)
- age, gender, description (TEXT)
- last_seen_location, last_seen_date
- photo_url, additional_photos
- status (ENUM: 'active', 'found', 'closed')
- priority_level (INTEGER)
```

#### Autres tables :
- `alerts` : Alertes de diffusion
- `sightings` : Signalements de témoins
- `volunteers` : Affectations de bénévoles
- `search_activities` : Activités de recherche
- `notifications` : Notifications utilisateur

## 🔒 Sécurité (RLS - Row Level Security)

### Politiques implémentées :
- **Profils** : Utilisateurs accèdent uniquement à leur profil
- **Personnes disparues** : Lecture publique des cas actifs, modification par le rapporteur
- **Signalements** : Lecture publique, création par utilisateurs authentifiés
- **Bénévoles** : Accès limité aux propres affectations
- **Notifications** : Accès limité aux propres notifications

## 🚀 Flux d'Authentification Complet

### Inscription (Nouvel utilisateur)
1. **Accueil** → Clic "Commencer"
2. **Inscription** → Saisie des informations + validation
3. **Envoi OTP** → `authService.sendOTP()` via Supabase
4. **Vérification OTP** → Saisie du code à 6 chiffres
5. **Vérification** → `authService.verifyOTP()` + `authService.createProfile()`
6. **Succès** → Navigation vers l'application principale

### Connexion (Utilisateur existant)
1. **Accueil** → Clic "Se connecter"
2. **Connexion** → Saisie du numéro + validation
3. **Envoi OTP** → `authService.sendOTP()` via Supabase
4. **Vérification OTP** → Saisie du code à 6 chiffres
5. **Vérification** → `authService.verifyOTP()` + vérification profil
6. **Succès** → Navigation vers l'application principale

### Gestion des erreurs
- Validation côté client avant envoi
- Gestion des erreurs réseau et serveur
- Messages d'erreur localisés en français
- Retry automatique pour les services SMS
- Fallback en cas d'échec de l'authentification

## 🧪 Tests à Effectuer

### Tests d'Inscription
- [ ] Validation des champs obligatoires
- [ ] Validation du format du numéro de téléphone
- [ ] Sélection du type d'utilisateur
- [ ] Envoi d'OTP réussi
- [ ] Gestion des erreurs d'envoi
- [ ] Vérification OTP correcte
- [ ] Vérification OTP incorrecte
- [ ] Création du profil utilisateur
- [ ] Navigation vers l'application

### Tests de Connexion
- [ ] Validation du numéro de téléphone
- [ ] Envoi d'OTP pour utilisateur existant
- [ ] Vérification OTP correcte
- [ ] Vérification OTP incorrecte
- [ ] Récupération du profil existant
- [ ] Navigation vers l'application

### Tests de Vérification OTP
- [ ] Saisie automatique et focus
- [ ] Timer de 60 secondes
- [ ] Fonction de renvoi de code
- [ ] Masquage du numéro de téléphone
- [ ] Gestion des codes expirés
- [ ] Limitation des tentatives

### Tests d'Intégration
- [ ] Flux complet inscription → vérification → profil
- [ ] Flux complet connexion → vérification → session
- [ ] Persistance de la session
- [ ] Déconnexion et reconnexion
- [ ] Gestion des erreurs réseau
- [ ] Compatibilité iOS/Android

## 📋 Configuration Requise

### Variables d'environnement (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme
EXPO_PUBLIC_TEXTBEE_API_KEY=votre-cle-textbee
EXPO_PUBLIC_TEXTBEE_DEVICE_ID=votre-device-id
EXPO_PUBLIC_TEXTBEE_BASE_URL=https://api.textbee.dev/api/v1
```

### Dépendances installées
- `@supabase/supabase-js` : Client Supabase
- `axios` : Requêtes HTTP pour TextBee
- `react-native-phone-number-input` : Saisie numéro de téléphone
- `react-native-country-picker-modal` : Sélecteur de pays

## 🔄 Prochaines Étapes

1. **Configuration Supabase** : Créer le projet et exécuter le schéma
2. **Configuration TextBee** : Obtenir les clés API
3. **Tests complets** : Valider tous les flux
4. **Optimisations** : Performance et UX
5. **Monitoring** : Logs et métriques d'utilisation

## 📚 Documentation Technique

- [Configuration Supabase](./SUPABASE_SETUP.md)
- [Schéma de base de données](./supabase/schema.sql)
- [Types TypeScript](./lib/supabase.ts)
- [Services d'authentification](./services/auth.ts)
- [Services SMS](./services/sms.ts)
