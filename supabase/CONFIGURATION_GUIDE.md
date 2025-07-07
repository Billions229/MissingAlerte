# Configuration Guide - SMS Hook avec TextBee

## Étapes de configuration

### 1. Configuration des variables d'environnement Supabase

Vous devez configurer les variables d'environnement dans votre projet Supabase :

1. **Accédez à votre dashboard Supabase**
2. **Allez dans Settings > Edge Functions**
3. **Ajoutez les variables d'environnement suivantes :**

```bash
# Secret pour sécuriser le SMS Hook (généré dans Auth > Hooks)
SUPABASE_SMS_HOOK_SECRET=your-generated-secret-from-supabase-dashboard

# Configuration TextBee API
TEXTBEE_API_KEY=your-textbee-api-key
TEXTBEE_DEVICE_ID=your-textbee-device-id
TEXTBEE_BASE_URL=https://api.textbee.dev/api/v1

# Configuration de l'application
APP_NAME=Missing Alert
```

### 2. Récupération des clés TextBee

1. **Connectez-vous à votre compte TextBee** : https://app.textbee.dev
2. **Récupérez votre API Key** dans les paramètres du compte
3. **Récupérez votre Device ID** depuis la liste de vos appareils

### 3. Configuration du SMS Hook dans Supabase

1. **Allez dans Auth > Hooks** dans votre dashboard Supabase
2. **Créez un nouveau hook de type "Send SMS hook"**
3. **Configurez :**
   - **Type** : HTTPS
   - **URL** : `https://[votre-projet-id].supabase.co/functions/v1/sms-hook`
   - **Secret** : Générez un secret sécurisé et copiez-le
4. **Activez le hook**

### 4. Déploiement de la fonction

Utilisez le Supabase CLI pour déployer la fonction :

```bash
# Installer le CLI Supabase si ce n'est pas fait
npm install -g supabase

# Se connecter à votre projet
supabase login
supabase link --project-ref [votre-projet-id]

# Déployer la fonction
supabase functions deploy sms-hook --no-verify-jwt
```

### 5. Test de la configuration

Après le déploiement, testez l'envoi d'OTP :

```typescript
// Dans votre application React Native
import { supabase } from './lib/supabase'

const testOTP = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    phone: '+33612345678', // Remplacez par un numéro valide
  })
  
  if (error) {
    console.error('Erreur:', error.message)
  } else {
    console.log('OTP envoyé avec succès!')
  }
}
```

## Dépannage

### Erreurs communes

1. **"Missing authorization header"**
   - Vérifiez que le secret est bien configuré dans les variables d'environnement
   - Vérifiez que le hook est activé dans Supabase

2. **"Configuration SMS manquante"**
   - Vérifiez que `TEXTBEE_API_KEY` et `TEXTBEE_DEVICE_ID` sont configurés
   - Vérifiez que les clés sont valides sur TextBee

3. **"Erreur HTTP 401/403"**
   - Vérifiez vos clés API TextBee
   - Vérifiez que votre appareil TextBee est en ligne

### Logs de débogage

Pour voir les logs de la fonction :

```bash
supabase functions logs sms-hook --follow
```

## Sécurité

- **Ne jamais exposer** vos clés API dans le code client
- **Utilisez toujours** les variables d'environnement Supabase
- **Régénérez** le secret du hook si vous suspectez une compromission
- **Limitez** l'accès aux variables d'environnement aux personnes autorisées
