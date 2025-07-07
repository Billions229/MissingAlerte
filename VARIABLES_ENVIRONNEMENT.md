# Variables d'environnement à configurer dans Supabase

## 📍 Où configurer ?
**Dashboard Supabase** → **Settings** → **Edge Functions** → **Environment Variables**

URL directe : https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/edge-functions

## 🔑 Variables à ajouter

### 1. SMS_HOOK_SECRET
```
Nom: SMS_HOOK_SECRET
Valeur: [À RÉCUPÉRER DEPUIS AUTH > HOOKS APRÈS CRÉATION DU HOOK]
```
⚠️ **Cette valeur sera générée à l'étape 4**

### 2. TEXTBEE_API_KEY
```
Nom: TEXTBEE_API_KEY
Valeur: [VOTRE CLÉ API TEXTBEE]
```
📍 **Où trouver ?** https://app.textbee.dev → Paramètres du compte

### 3. TEXTBEE_DEVICE_ID
```
Nom: TEXTBEE_DEVICE_ID
Valeur: [VOTRE DEVICE ID TEXTBEE]
```
📍 **Où trouver ?** https://app.textbee.dev → Liste des appareils

### 4. TEXTBEE_BASE_URL
```
Nom: TEXTBEE_BASE_URL
Valeur: https://api.textbee.dev/api/v1
```

### 5. APP_NAME
```
Nom: APP_NAME
Valeur: Missing Alert
```

## 📋 Checklist de configuration

- [ ] Ouvrir le dashboard Supabase
- [ ] Aller dans Settings → Edge Functions
- [ ] Ajouter TEXTBEE_API_KEY
- [ ] Ajouter TEXTBEE_DEVICE_ID  
- [ ] Ajouter TEXTBEE_BASE_URL
- [ ] Ajouter APP_NAME
- [ ] Noter que SUPABASE_SMS_HOOK_SECRET sera ajouté à l'étape 4

## 🔍 Comment récupérer vos clés TextBee

### API Key
1. Connectez-vous à https://app.textbee.dev
2. Allez dans **Account Settings** ou **Paramètres du compte**
3. Copiez votre **API Key**

### Device ID
1. Dans TextBee, allez dans **Devices** ou **Appareils**
2. Sélectionnez l'appareil que vous voulez utiliser
3. Copiez le **Device ID**

## ⚠️ Important
- **Ne partagez jamais** vos clés API
- **Vérifiez** que votre appareil TextBee est en ligne
- **Testez** vos clés avant de continuer

## 🔄 Après configuration
Une fois toutes les variables ajoutées (sauf SUPABASE_SMS_HOOK_SECRET), vous pouvez passer à l'étape 3 : Déploiement de la fonction.
