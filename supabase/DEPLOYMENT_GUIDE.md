# Guide de Déploiement - SMS Hook TextBee

## Prérequis

1. **Supabase CLI installé** :
   ```bash
   npm install -g supabase
   ```

2. **Compte Supabase configuré** avec un projet actif

3. **Compte TextBee** avec API Key et Device ID

## Étapes de déploiement

### 1. Installation et connexion Supabase CLI

```bash
# Se connecter à Supabase
supabase login

# Lier votre projet local au projet Supabase
supabase link --project-ref [votre-project-id]
```

### 2. Configuration des variables d'environnement

Dans votre dashboard Supabase (Settings > Edge Functions), ajoutez :

```bash
SUPABASE_SMS_HOOK_SECRET=your-generated-secret
TEXTBEE_API_KEY=your-textbee-api-key
TEXTBEE_DEVICE_ID=your-textbee-device-id
TEXTBEE_BASE_URL=https://api.textbee.dev/api/v1
APP_NAME=Missing Alert
```

### 3. Déploiement de la fonction

```bash
# Déployer la fonction SMS Hook
supabase functions deploy sms-hook --no-verify-jwt

# Vérifier le déploiement
supabase functions list
```

### 4. Configuration du Hook dans Supabase

1. **Dashboard Supabase** → **Auth** → **Hooks**
2. **Créer un nouveau hook** :
   - Type: **Send SMS hook**
   - Method: **HTTPS**
   - URL: `https://[votre-project-id].supabase.co/functions/v1/sms-hook`
   - Secret: Générez et copiez le secret
3. **Activer le hook**

### 5. Mise à jour des variables d'environnement

Ajoutez le secret généré dans les variables d'environnement :

```bash
SUPABASE_SMS_HOOK_SECRET=le-secret-genere-dans-le-dashboard
```

## Tests

### Test 1: Fonction directe

```bash
# Voir les logs en temps réel
supabase functions logs sms-hook --follow
```

### Test 2: Script de test

```bash
# Configurer le script de test
# Éditez scripts/test-sms-hook.js avec vos vraies valeurs

# Exécuter le test
node scripts/test-sms-hook.js
```

### Test 3: Intégration complète

```typescript
// Dans votre app React Native
import { supabase } from './lib/supabase'

const testAuth = async () => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: '+33612345678' // Votre numéro de test
    })
    
    if (error) {
      console.error('Erreur:', error.message)
    } else {
      console.log('OTP envoyé avec succès!')
    }
  } catch (err) {
    console.error('Erreur inattendue:', err)
  }
}
```

## Vérification du déploiement

### 1. Vérifier que la fonction est déployée

```bash
supabase functions list
```

Vous devriez voir `sms-hook` dans la liste.

### 2. Vérifier les logs

```bash
supabase functions logs sms-hook
```

### 3. Tester l'endpoint

```bash
curl -X POST \
  https://[votre-project-id].supabase.co/functions/v1/sms-hook \
  -H "Authorization: Bearer [votre-hook-secret]" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": "test-id",
      "phone": "+33612345678"
    },
    "otp": "123456",
    "token_hash": "test-hash"
  }'
```

## Dépannage

### Erreurs communes

1. **"Function not found"**
   ```bash
   # Redéployer la fonction
   supabase functions deploy sms-hook --no-verify-jwt
   ```

2. **"Environment variable not found"**
   - Vérifiez les variables dans Settings > Edge Functions
   - Redéployez après avoir ajouté les variables

3. **"Hook not triggered"**
   - Vérifiez que le hook est activé dans Auth > Hooks
   - Vérifiez l'URL du hook
   - Vérifiez le secret

4. **"TextBee API error"**
   - Vérifiez vos clés API TextBee
   - Vérifiez que votre appareil est en ligne
   - Vérifiez le format du numéro de téléphone

### Logs utiles

```bash
# Logs en temps réel
supabase functions logs sms-hook --follow

# Logs des dernières 24h
supabase functions logs sms-hook --since=24h

# Logs avec plus de détails
supabase functions logs sms-hook --level=debug
```

## Mise à jour

Pour mettre à jour la fonction :

```bash
# Modifier le code dans supabase/functions/sms-hook/index.ts
# Puis redéployer
supabase functions deploy sms-hook --no-verify-jwt
```

## Sécurité

- ✅ Les clés API ne sont jamais exposées côté client
- ✅ Communication sécurisée via HTTPS
- ✅ Authentification par secret partagé
- ✅ Validation des payloads entrants
- ✅ Logs pour audit et débogage
