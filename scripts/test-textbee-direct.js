/**
 * Test direct de l'API TextBee pour vérifier les clés
 * Usage: node scripts/test-textbee-direct.js
 */

const https = require('https');

// Configuration depuis votre .env
const TEXTBEE_API_KEY = '7036c05b-6a14-47c2-ad0e-19ece9f6f6ab';
const TEXTBEE_DEVICE_ID = '684fbadce8400c157a75e2ca';
const TEXTBEE_BASE_URL = 'https://api.textbee.dev/api/v1';

async function testTextBeeAPI() {
  console.log('🐝 Test direct de l\'API TextBee...');
  console.log('🔑 API Key:', TEXTBEE_API_KEY);
  console.log('📱 Device ID:', TEXTBEE_DEVICE_ID);
  console.log('🔗 Base URL:', TEXTBEE_BASE_URL);
  console.log('');

  const testMessage = {
    message: 'Test depuis Missing Alert: Votre code est 123456',
    phone: '+22952902192'
  };

  const postData = JSON.stringify({
    message: testMessage.message,
    phone: testMessage.phone,
    device_id: TEXTBEE_DEVICE_ID
  });

  const options = {
    hostname: 'api.textbee.dev',
    port: 443,
    path: '/api/v1/gateway/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': TEXTBEE_API_KEY,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    console.log('📤 Envoi du message de test...');
    
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📊 Status Code:', res.statusCode);
        console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
        console.log('📄 Response:', data);
        console.log('');

        if (res.statusCode === 200) {
          console.log('✅ Test TextBee réussi!');
          console.log('🎉 Vos clés API sont valides et l\'appareil est accessible.');
          console.log('');
          console.log('📱 Vérifiez votre téléphone pour le SMS de test!');
        } else {
          console.log('❌ Test TextBee échoué!');
          console.log('🔧 Vérifications à faire:');
          console.log('1. Clé API valide dans TextBee Dashboard');
          console.log('2. Device ID correct');
          console.log('3. Appareil TextBee en ligne et connecté');
          console.log('4. Crédit suffisant sur le compte TextBee');
        }

        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.log('❌ Erreur de connexion:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Informations utiles
function showInfo() {
  console.log('📋 Informations utiles:');
  console.log('');
  console.log('🐝 TextBee Dashboard:', 'https://app.textbee.dev');
  console.log('📱 Vérifiez que votre appareil est en ligne');
  console.log('💰 Vérifiez votre crédit TextBee');
  console.log('🔑 Vérifiez vos clés API dans les paramètres');
  console.log('');
}

// Exécution du test
console.log('🧪 Test direct TextBee API');
console.log('==========================');
console.log('');

showInfo();
testTextBeeAPI().catch(console.error);
