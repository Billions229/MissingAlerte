# Intégration SMS Hook - Supabase + TextBee

Cette intégration permet d'utiliser **TextBee** comme fournisseur SMS pour l'authentification Supabase via un SMS Hook personnalisé.

## 📁 Structure des fichiers

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts                 # Configuration CORS partagée
│   └── sms-hook/
│       ├── index.ts                # Fonction principale SMS Hook
│       └── deno.json               # Configuration Deno
├── .env.example                    # Exemple de variables d'environnement
├── CONFIGURATION_GUIDE.md          # Guide de configuration détaillé
├── DEPLOYMENT_GUIDE.md             # Guide de déploiement
├── README.md                       # Ce fichier
└── schema.sql                      # Schéma de base de données
```

## 🚀 Démarrage rapide

### 1. Configuration

1. **Copiez `.env.example`** et configurez vos variables d'environnement dans Supabase
2. **Suivez le guide** dans `CONFIGURATION_GUIDE.md`

### 2. Déploiement

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter et lier le projet
supabase login
supabase link --project-ref [votre-project-id]

# Déployer la fonction
supabase functions deploy sms-hook --no-verify-jwt
```

### 3. Configuration du Hook

1. **Dashboard Supabase** → **Auth** → **Hooks**
2. **Créer un SMS Hook** avec l'URL de votre fonction
3. **Activer le hook**

## 🔧 Configuration requise

### Variables d'environnement Supabase

```bash
SUPABASE_SMS_HOOK_SECRET=your-generated-secret
TEXTBEE_API_KEY=your-textbee-api-key
TEXTBEE_DEVICE_ID=your-textbee-device-id
TEXTBEE_BASE_URL=https://api.textbee.dev/api/v1
APP_NAME=Missing Alert
```

### Clés TextBee

1. **Compte TextBee** : https://app.textbee.dev
2. **API Key** : Dans les paramètres du compte
3. **Device ID** : Dans la liste des appareils

## 📱 Utilisation dans l'app

```typescript
import { supabase } from './lib/supabase'

// Envoyer un OTP
const { error } = await supabase.auth.signInWithOtp({
  phone: '+33612345678'
})

// Vérifier l'OTP
const { error } = await supabase.auth.verifyOtp({
  phone: '+33612345678',
  token: '123456',
  type: 'sms'
})
```

## 🧪 Tests

### Test de la fonction

```bash
# Configurer et exécuter le script de test
node scripts/test-sms-hook.js
```

### Logs en temps réel

```bash
supabase functions logs sms-hook --follow
```

## 📚 Documentation

- **Configuration** : `CONFIGURATION_GUIDE.md`
- **Déploiement** : `DEPLOYMENT_GUIDE.md`
- **API TextBee** : https://docs.textbee.dev
- **Supabase SMS Hooks** : https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook

## 🔒 Sécurité

- ✅ Clés API sécurisées côté serveur
- ✅ Authentification par secret partagé
- ✅ Communication HTTPS uniquement
- ✅ Validation des payloads
- ✅ Logs d'audit

## 🐛 Dépannage

### Problèmes courants

1. **Hook non déclenché** → Vérifiez l'activation dans le dashboard
2. **Erreur d'authentification** → Vérifiez le secret du hook
3. **Erreur TextBee** → Vérifiez vos clés API et l'état de l'appareil
4. **Timeout** → Vérifiez la connectivité réseau

### Logs utiles

```bash
# Voir tous les logs
supabase functions logs sms-hook

# Logs en temps réel
supabase functions logs sms-hook --follow

# Logs détaillés
supabase functions logs sms-hook --level=debug
```

## 🔄 Workflow complet

1. **Utilisateur** demande un OTP via `supabase.auth.signInWithOtp()`
2. **Supabase Auth** génère un OTP et appelle le SMS Hook
3. **SMS Hook** reçoit la requête avec le numéro et l'OTP
4. **Fonction Edge** appelle l'API TextBee pour envoyer le SMS
5. **TextBee** envoie le SMS à l'utilisateur
6. **Utilisateur** reçoit le SMS et saisit l'OTP
7. **App** vérifie l'OTP avec `supabase.auth.verifyOtp()`

## 📞 Support

- **Issues GitHub** : Pour les problèmes liés au code
- **Documentation Supabase** : Pour les questions sur les hooks
- **Support TextBee** : Pour les problèmes d'API SMS
