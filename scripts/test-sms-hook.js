/**
 * Script de test pour la fonction SMS Hook
 * Usage: node scripts/test-sms-hook.js
 */

const https = require('https');

// Configuration - Remplacez par vos vraies valeurs
const config = {
  supabaseUrl: 'https://wzixsqcamriroqavnhvn.supabase.co',
  hookSecret: 'your-hook-secret', // Remplacez par votre vrai secret SMS_HOOK_SECRET
  testPhone: '+33612345678', // Remplacez par un numéro de test valide
};

// Payload de test simulant une requête Supabase
const testPayload = {
  user: {
    id: 'test-user-id',
    phone: config.testPhone,
    email: 'test@example.com'
  },
  otp: '123456',
  token_hash: 'test-token-hash',
  redirect_to: null
};

function testSMSHook() {
  const data = JSON.stringify(testPayload);
  
  const options = {
    hostname: config.supabaseUrl.replace('https://', ''),
    port: 443,
    path: '/functions/v1/sms-hook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': `Bearer ${config.hookSecret}`
    }
  };

  console.log('🧪 Test de la fonction SMS Hook...');
  console.log('📱 Numéro de test:', config.testPhone);
  console.log('🔐 Code OTP:', testPayload.otp);
  console.log('');

  const req = https.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    console.log('');

    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('📨 Réponse de la fonction:');
        console.log(JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200 && response.success) {
          console.log('');
          console.log('✅ Test réussi! SMS envoyé avec succès.');
          if (response.messageId) {
            console.log(`📧 Message ID: ${response.messageId}`);
          }
        } else {
          console.log('');
          console.log('❌ Test échoué.');
          console.log('Erreur:', response.error || 'Erreur inconnue');
        }
      } catch (error) {
        console.log('❌ Erreur lors du parsing de la réponse:');
        console.log('Raw response:', responseData);
        console.log('Parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Erreur de requête:', error.message);
  });

  req.write(data);
  req.end();
}

// Vérification de la configuration
function validateConfig() {
  const errors = [];
  
  if (!config.supabaseUrl || config.supabaseUrl === 'https://your-project-id.supabase.co') {
    errors.push('❌ Veuillez configurer supabaseUrl avec votre vraie URL Supabase');
  }
  
  if (!config.hookSecret || config.hookSecret === 'your-hook-secret') {
    errors.push('❌ Veuillez configurer hookSecret avec votre vrai secret de hook');
  }
  
  if (!config.testPhone || config.testPhone === '+33612345678') {
    errors.push('⚠️  Veuillez configurer testPhone avec un numéro de test valide');
  }
  
  if (errors.length > 0) {
    console.log('🔧 Configuration requise:');
    console.log('');
    errors.forEach(error => console.log(error));
    console.log('');
    console.log('📝 Éditez le fichier scripts/test-sms-hook.js pour configurer les valeurs.');
    return false;
  }
  
  return true;
}

// Exécution du test
if (validateConfig()) {
  testSMSHook();
}
