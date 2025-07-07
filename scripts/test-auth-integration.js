/**
 * Script de test pour l'intégration complète Supabase Auth + SMS Hook + TextBee
 * Usage: node scripts/test-auth-integration.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase depuis .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Numéro de test
const testPhoneNumber = '+22952902192';

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSMSAuth() {
  console.log('🧪 Test de l\'authentification SMS via Supabase...');
  console.log('📱 Numéro de test:', testPhoneNumber);
  console.log('');

  try {
    // Test 1: Envoyer un OTP
    console.log('📤 Envoi de l\'OTP...');
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: testPhoneNumber,
    });

    if (error) {
      console.log('❌ Erreur lors de l\'envoi de l\'OTP:');
      console.log('Code:', error.status || 'N/A');
      console.log('Message:', error.message);
      console.log('Détails:', error.details || 'N/A');
      return;
    }

    console.log('✅ OTP envoyé avec succès!');
    console.log('📊 Réponse Supabase:', JSON.stringify(data, null, 2));
    console.log('');
    console.log('📱 Vérifiez votre téléphone pour le SMS!');
    console.log('');
    console.log('🔍 Pour vérifier l\'OTP, utilisez:');
    console.log('```javascript');
    console.log('const { data, error } = await supabase.auth.verifyOtp({');
    console.log(`  phone: '${testPhoneNumber}',`);
    console.log('  token: \'123456\', // Le code reçu par SMS');
    console.log('  type: \'sms\'');
    console.log('});');
    console.log('```');

  } catch (err) {
    console.log('❌ Erreur inattendue:', err.message);
    console.log('Stack:', err.stack);
  }
}

// Vérification de la configuration
function validateConfig() {
  const errors = [];

  if (!supabaseUrl) {
    errors.push('❌ EXPO_PUBLIC_SUPABASE_URL manquant dans .env');
  }

  if (!supabaseAnonKey) {
    errors.push('❌ EXPO_PUBLIC_SUPABASE_ANON_KEY manquant dans .env');
  }

  if (!testPhoneNumber) {
    errors.push('❌ Numéro de téléphone de test non configuré');
  }

  if (errors.length > 0) {
    console.log('🔧 Configuration requise:');
    console.log('');
    errors.forEach(error => console.log(error));
    console.log('');
    console.log('📝 Vérifiez le fichier .env et les variables d\'environnement.');
    return false;
  }

  console.log('✅ Configuration chargée depuis .env');
  console.log('📱 Numéro de test:', testPhoneNumber);
  console.log('🔗 URL Supabase:', supabaseUrl);

  return true;
}

// Informations utiles
function showInfo() {
  console.log('📋 Informations utiles:');
  console.log('');
  console.log('🔗 Dashboard Supabase:', `https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn`);
  console.log('📊 Logs de la fonction:', 'supabase functions logs sms-hook --follow');
  console.log('🔧 Variables d\'environnement:', 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/edge-functions');
  console.log('📱 Auth Hooks:', 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/auth/hooks');
  console.log('');
}

// Exécution du test
console.log('🚀 Test d\'intégration SMS - Supabase + TextBee');
console.log('================================================');
console.log('');

showInfo();

if (validateConfig()) {
  testSMSAuth();
} else {
  console.log('⚠️  Configurez d\'abord les valeurs requises.');
}
