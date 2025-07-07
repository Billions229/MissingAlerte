# Guide de Tests - Intégration SMS Hook + TextBee

## 🎯 Objectif
Tester que l'intégration complète fonctionne : Supabase Auth → SMS Hook → TextBee → SMS reçu

## 📋 Prérequis pour les tests

### 1. Récupérer la clé anonyme Supabase
**Dashboard ouvert :** https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/api

1. Copiez la **"anon public"** key
2. Mettez-la dans `scripts/test-auth-integration.js` ligne 10

### 2. Configurer un numéro de test
- Remplacez `+33612345678` par votre vrai numéro de téléphone
- Format international requis (ex: +33612345678, +1234567890)

## 🧪 Tests disponibles

### Test 1 : Logs en temps réel
```bash
# Terminal déjà ouvert - surveillez les logs
supabase functions logs sms-hook --follow
```

### Test 2 : Test direct de la fonction
```bash
# Configurez d'abord le secret dans scripts/test-sms-hook.js
node scripts/test-sms-hook.js
```

### Test 3 : Test via Supabase Auth (Recommandé)
```bash
# Configurez d'abord la clé anon dans scripts/test-auth-integration.js
node scripts/test-auth-integration.js
```

### Test 4 : Test depuis votre app React Native
```typescript
// Dans votre application
import { supabase } from './lib/supabase'

const testOTP = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    phone: '+33612345678' // Votre numéro
  })
  
  if (error) {
    console.error('Erreur:', error.message)
  } else {
    console.log('OTP envoyé!')
  }
}
```

## 🔍 Que surveiller pendant les tests

### Dans les logs Supabase (Terminal)
✅ **Succès :**
```
SMS Hook payload received: { userId: "...", phone: "+33..." }
SMS sent successfully: { messageId: "...", phone: "+33..." }
```

❌ **Erreurs possibles :**
```
Missing authorization header or hook secret
Configuration SMS manquante
Erreur HTTP 401/403 (TextBee)
```

### Dans la réponse du test
✅ **Succès :**
```json
{
  "success": true,
  "messageId": "abc123"
}
```

❌ **Erreurs possibles :**
```json
{
  "error": "Failed to send SMS",
  "details": "..."
}
```

### Sur votre téléphone
✅ **SMS reçu :**
```
Missing Alert: Votre code de vérification est 123456. 
Ce code expire dans 10 minutes. Ne le partagez avec personne.
```

## 🐛 Dépannage

### Erreur "Missing authorization header"
- Vérifiez que `SMS_HOOK_SECRET` est bien configuré
- Vérifiez que le secret correspond à celui du hook

### Erreur "Configuration SMS manquante"
- Vérifiez `TEXTBEE_API_KEY` et `TEXTBEE_DEVICE_ID`
- Vérifiez que les clés sont valides sur TextBee

### Erreur "Erreur HTTP 401/403"
- Vérifiez vos clés API TextBee
- Vérifiez que votre appareil TextBee est en ligne

### Pas de SMS reçu
- Vérifiez le format du numéro (+33...)
- Vérifiez que l'appareil TextBee a du réseau
- Vérifiez les logs pour voir si l'envoi a réussi

## 📊 Dashboards utiles

- **Logs fonction :** Terminal avec `supabase functions logs sms-hook --follow`
- **Variables env :** https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/edge-functions
- **Auth Hooks :** https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/auth/hooks
- **TextBee Dashboard :** https://app.textbee.dev

## ✅ Test réussi si...

1. ✅ Les logs montrent "SMS sent successfully"
2. ✅ Le test retourne `success: true`
3. ✅ Vous recevez le SMS sur votre téléphone
4. ✅ Le message contient le bon code OTP

## 🔄 Après les tests

Si tout fonctionne, votre intégration est prête ! Vous pouvez maintenant utiliser `supabase.auth.signInWithOtp()` dans votre app React Native.
