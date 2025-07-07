# Configuration Supabase pour Missing Alert

## 🚀 Étapes de Configuration

### 1. Créer un Projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL du projet et la clé anonyme (anon key)

### 2. Configuration de l'Authentification

#### Activer l'authentification par téléphone
1. Dans le dashboard Supabase, allez dans **Authentication > Settings**
2. Activez **Phone Auth**
3. Configurez votre fournisseur SMS (Twilio recommandé pour la production)

#### Configuration SMS pour le développement
Pour les tests, vous pouvez utiliser le mode test de Supabase :
1. Dans **Authentication > Settings > Phone Auth**
2. Activez **Enable phone confirmations**
3. Pour les tests, utilisez des numéros de test comme `+1234567890`

### 3. Exécuter le Schéma de Base de Données

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `supabase/schema.sql`
3. Exécutez le script pour créer toutes les tables et politiques

### 4. Configuration des Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme

# TextBee SMS Service Configuration
EXPO_PUBLIC_TEXTBEE_API_KEY=votre-cle-textbee
EXPO_PUBLIC_TEXTBEE_DEVICE_ID=votre-device-id
EXPO_PUBLIC_TEXTBEE_BASE_URL=https://api.textbee.dev/api/v1

# App Configuration
EXPO_PUBLIC_APP_ENV=development
```

### 5. Configuration des Politiques RLS (Row Level Security)

Les politiques RLS sont déjà définies dans le schéma. Elles garantissent que :

- **Profils** : Les utilisateurs ne peuvent voir/modifier que leur propre profil
- **Personnes disparues** : Tout le monde peut voir les cas actifs, seuls les rapporteurs peuvent modifier
- **Signalements** : Tout le monde peut voir, les utilisateurs authentifiés peuvent créer
- **Bénévoles** : Les bénévoles ne voient que leurs propres affectations
- **Notifications** : Les utilisateurs ne voient que leurs propres notifications

### 6. Configuration du Stockage (Storage)

Pour les photos des personnes disparues :

1. Dans **Storage**, créez un bucket `missing-persons-photos`
2. Configurez les politiques :
   ```sql
   -- Permettre la lecture publique des photos
   CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'missing-persons-photos');
   
   -- Permettre l'upload aux utilisateurs authentifiés
   CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
     bucket_id = 'missing-persons-photos' AND auth.role() = 'authenticated'
   );
   ```

### 7. Configuration des Webhooks (Optionnel)

Pour les notifications en temps réel :

1. Dans **Database > Webhooks**
2. Créez des webhooks pour :
   - Nouvelles personnes disparues
   - Nouveaux signalements
   - Mises à jour de statut

### 8. Configuration de l'API TextBee

#### Inscription à TextBee
1. Allez sur [textbee.dev](https://textbee.dev)
2. Créez un compte et obtenez votre API key
3. Configurez un device pour l'envoi de SMS

#### Configuration dans l'app
Les services SMS sont déjà configurés dans `services/sms.ts`. Assurez-vous que vos variables d'environnement sont correctes.

## 🔧 Services Configurés

### Service d'Authentification (`services/auth.ts`)
- Envoi d'OTP par SMS
- Vérification d'OTP
- Gestion des profils utilisateur
- Sessions persistantes

### Service SMS (`services/sms.ts`)
- Envoi de SMS via TextBee
- Génération de codes OTP
- Validation des numéros de téléphone
- Gestion des erreurs et retry

### Client Supabase (`lib/supabase.ts`)
- Configuration du client avec AsyncStorage
- Types TypeScript pour la base de données
- Auto-refresh des tokens

## 📱 Flux d'Authentification

1. **Inscription** (`/signup`) :
   - Saisie des informations utilisateur
   - Envoi d'OTP via Supabase Auth
   - Redirection vers vérification OTP

2. **Connexion** (`/login`) :
   - Saisie du numéro de téléphone
   - Envoi d'OTP via Supabase Auth
   - Redirection vers vérification OTP

3. **Vérification OTP** (`/verify-otp`) :
   - Saisie du code à 6 chiffres
   - Vérification via Supabase Auth
   - Création/mise à jour du profil
   - Redirection vers l'app principale

## 🛡️ Sécurité

### Politiques RLS
- Toutes les tables ont des politiques RLS activées
- Les utilisateurs ne peuvent accéder qu'à leurs données autorisées
- Les données publiques (personnes disparues actives) sont accessibles à tous

### Validation des Données
- Validation côté client et serveur
- Sanitisation des entrées utilisateur
- Vérification des permissions

### Gestion des Sessions
- Sessions persistantes avec AsyncStorage
- Auto-refresh des tokens
- Déconnexion automatique en cas d'expiration

## 🧪 Tests

### Tests d'Authentification
```bash
# Tester l'envoi d'OTP
curl -X POST 'https://votre-projet.supabase.co/auth/v1/otp' \
  -H 'apikey: votre-cle-anonyme' \
  -H 'Content-Type: application/json' \
  -d '{"phone": "+1234567890"}'

# Tester la vérification d'OTP
curl -X POST 'https://votre-projet.supabase.co/auth/v1/verify' \
  -H 'apikey: votre-cle-anonyme' \
  -H 'Content-Type: application/json' \
  -d '{"type": "sms", "phone": "+1234567890", "token": "123456"}'
```

### Tests de Base de Données
1. Créez des données de test via le dashboard Supabase
2. Testez les politiques RLS avec différents utilisateurs
3. Vérifiez les triggers et fonctions

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur "Invalid API key"**
   - Vérifiez que `EXPO_PUBLIC_SUPABASE_ANON_KEY` est correct
   - Assurez-vous que la clé n'a pas d'espaces

2. **Erreur "Phone auth not enabled"**
   - Activez l'authentification par téléphone dans le dashboard
   - Configurez un fournisseur SMS

3. **Erreur "Row Level Security"**
   - Vérifiez que les politiques RLS sont correctement configurées
   - Assurez-vous que l'utilisateur est authentifié

4. **Problèmes SMS TextBee**
   - Vérifiez votre crédit TextBee
   - Testez avec l'API directement
   - Vérifiez les logs d'erreur

### Logs et Monitoring
- Utilisez les logs Supabase pour déboguer
- Activez les logs détaillés en développement
- Surveillez les métriques d'utilisation

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation TextBee](https://textbee.dev/docs)
- [Guide RLS Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [React Native Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
