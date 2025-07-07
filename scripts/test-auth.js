#!/usr/bin/env node

/**
 * Script de test pour l'authentification Missing Alert
 * Ce script teste les services d'authentification et SMS
 */

const axios = require('axios');

// Configuration de test
const TEST_CONFIG = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  textbeeApiKey: process.env.EXPO_PUBLIC_TEXTBEE_API_KEY || 'your-textbee-key',
  textbeeDeviceId: process.env.EXPO_PUBLIC_TEXTBEE_DEVICE_ID || 'your-device-id',
  textbeeBaseUrl: process.env.EXPO_PUBLIC_TEXTBEE_BASE_URL || 'https://api.textbee.dev/api/v1',
  testPhoneNumber: '+1234567890', // Numéro de test
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test de la configuration
async function testConfiguration() {
  log('\n🔧 Test de la configuration...', 'cyan');
  
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'EXPO_PUBLIC_TEXTBEE_API_KEY',
    'EXPO_PUBLIC_TEXTBEE_DEVICE_ID',
  ];

  let configValid = true;

  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('your-')) {
      logError(`Variable manquante ou invalide: ${varName}`);
      configValid = false;
    } else {
      logSuccess(`${varName} configurée`);
    }
  }

  if (!configValid) {
    logWarning('Certaines variables d\'environnement ne sont pas configurées.');
    logInfo('Créez un fichier .env avec les bonnes valeurs pour des tests complets.');
  }

  return configValid;
}

// Test de connexion Supabase
async function testSupabaseConnection() {
  log('\n🗄️  Test de connexion Supabase...', 'cyan');
  
  try {
    const response = await axios.get(`${TEST_CONFIG.supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': TEST_CONFIG.supabaseKey,
        'Authorization': `Bearer ${TEST_CONFIG.supabaseKey}`,
      },
      timeout: 5000,
    });

    if (response.status === 200) {
      logSuccess('Connexion Supabase réussie');
      return true;
    } else {
      logError(`Erreur Supabase: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Erreur de connexion Supabase: ${error.message}`);
    return false;
  }
}

// Test de l'API TextBee
async function testTextBeeConnection() {
  log('\n📱 Test de connexion TextBee...', 'cyan');
  
  try {
    const response = await axios.get(
      `${TEST_CONFIG.textbeeBaseUrl}/gateway/devices/${TEST_CONFIG.textbeeDeviceId}/status`,
      {
        headers: {
          'x-api-key': TEST_CONFIG.textbeeApiKey,
        },
        timeout: 5000,
      }
    );

    if (response.status === 200) {
      logSuccess('Connexion TextBee réussie');
      logInfo(`Statut du device: ${JSON.stringify(response.data, null, 2)}`);
      return true;
    } else {
      logError(`Erreur TextBee: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(`Erreur API TextBee: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else {
      logError(`Erreur de connexion TextBee: ${error.message}`);
    }
    return false;
  }
}

// Test d'envoi d'OTP Supabase
async function testSupabaseOTP() {
  log('\n🔐 Test d\'envoi OTP Supabase...', 'cyan');
  
  try {
    const response = await axios.post(
      `${TEST_CONFIG.supabaseUrl}/auth/v1/otp`,
      {
        phone: TEST_CONFIG.testPhoneNumber,
      },
      {
        headers: {
          'apikey': TEST_CONFIG.supabaseKey,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.status === 200) {
      logSuccess('Envoi OTP Supabase réussi');
      logInfo('Vérifiez votre téléphone pour le code OTP');
      return true;
    } else {
      logError(`Erreur envoi OTP: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(`Erreur API Supabase OTP: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else {
      logError(`Erreur envoi OTP: ${error.message}`);
    }
    return false;
  }
}

// Test d'envoi SMS TextBee
async function testTextBeeSMS() {
  log('\n📨 Test d\'envoi SMS TextBee...', 'cyan');
  
  try {
    const message = `Missing Alert Test: Code de vérification 123456. Ce message est un test.`;
    
    const response = await axios.post(
      `${TEST_CONFIG.textbeeBaseUrl}/gateway/devices/${TEST_CONFIG.textbeeDeviceId}/send-sms`,
      {
        recipients: [TEST_CONFIG.testPhoneNumber],
        message: message,
      },
      {
        headers: {
          'x-api-key': TEST_CONFIG.textbeeApiKey,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.status === 200 || response.status === 201) {
      logSuccess('Envoi SMS TextBee réussi');
      logInfo(`ID du message: ${response.data?.messageId || response.data?.id || 'N/A'}`);
      return true;
    } else {
      logError(`Erreur envoi SMS: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(`Erreur API TextBee SMS: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else {
      logError(`Erreur envoi SMS: ${error.message}`);
    }
    return false;
  }
}

// Test de validation des numéros de téléphone
function testPhoneValidation() {
  log('\n📞 Test de validation des numéros...', 'cyan');
  
  const testCases = [
    { phone: '+1234567890', valid: true },
    { phone: '+33123456789', valid: true },
    { phone: '+229123456789', valid: true },
    { phone: '1234567890', valid: false },
    { phone: '+123', valid: false },
    { phone: '+12345678901234567890', valid: false },
    { phone: 'invalid', valid: false },
  ];

  let allPassed = true;

  for (const testCase of testCases) {
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    const isValid = phoneRegex.test(testCase.phone);
    
    if (isValid === testCase.valid) {
      logSuccess(`${testCase.phone} → ${isValid ? 'Valide' : 'Invalide'} ✓`);
    } else {
      logError(`${testCase.phone} → Attendu: ${testCase.valid}, Obtenu: ${isValid} ✗`);
      allPassed = false;
    }
  }

  return allPassed;
}

// Fonction principale
async function runTests() {
  log('🚀 Démarrage des tests d\'authentification Missing Alert', 'magenta');
  log('=' .repeat(60), 'magenta');

  const results = {
    config: await testConfiguration(),
    phoneValidation: testPhoneValidation(),
    supabaseConnection: await testSupabaseConnection(),
    textbeeConnection: await testTextBeeConnection(),
  };

  // Tests optionnels (nécessitent une configuration complète)
  if (results.config) {
    results.supabaseOTP = await testSupabaseOTP();
    results.textbeeSMS = await testTextBeeSMS();
  }

  // Résumé
  log('\n📊 Résumé des tests:', 'cyan');
  log('=' .repeat(40), 'cyan');

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;

  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    log(`${test.padEnd(20)} ${status}`);
  }

  log(`\nRésultat: ${passedTests}/${totalTests} tests réussis`, passedTests === totalTests ? 'green' : 'yellow');

  if (passedTests === totalTests) {
    log('\n🎉 Tous les tests sont passés ! L\'authentification est prête.', 'green');
  } else {
    log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.', 'yellow');
  }

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Exécution
if (require.main === module) {
  runTests().catch(error => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testConfiguration,
  testSupabaseConnection,
  testTextBeeConnection,
  testSupabaseOTP,
  testTextBeeSMS,
  testPhoneValidation,
};
