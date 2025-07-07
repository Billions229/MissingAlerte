/**
 * Test simple de l'intégration SMS Hook + TextBee
 * Usage: node scripts/test-sms-simple.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration depuis votre .env
const supabaseUrl = 'https://wzixsqcamriroqavnhvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aXhzcWNhbXJpcm9xYXZuaHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODQ4NjYsImV4cCI6MjA2NzQ2MDg2Nn0.WOVv0E5cKxxDI_Hm802FW9EPXW9YSMkz99J84BmvQggs';

// Numéro de test
const testPhoneNumber = '+22952902192';

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSMSAuth() {
  console.log('🧪 Test de l\'authentification SMS via Supabase...');
  console.log('📱 Numéro de test:', testPhoneNumber);
  console.log('🔗 URL Supabase:', supabaseUrl);
  console.log('');

  try {
    console.log('📤 Envoi de l\'OTP...');
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: testPhoneNumber,
    });

    if (error) {
      console.log('❌ Erreur lors de l\'envoi de l\'OTP:');
      console.log('Code:', error.status || 'N/A');
      console.log('Message:', error.message);
      console.log('Détails:', error.details || 'N/A');
      console.log('');
      
      // Suggestions de dépannage
      console.log('🔧 Vérifications à faire:');
      console.log('1. Variables d\'environnement dans Supabase Dashboard');
      console.log('2. SMS Hook configuré et activé');
      console.log('3. Clés TextBee valides et appareil en ligne');
      console.log('4. Format du numéro de téléphone (+229...)');
      
      return;
    }

    console.log('✅ OTP envoyé avec succès!');
    console.log('📊 Réponse Supabase:', JSON.stringify(data, null, 2));
    console.log('');
    console.log('📱 Vérifiez votre téléphone (+22952902192) pour le SMS!');
    console.log('');
    console.log('🎉 Si vous avez reçu le SMS, l\'intégration fonctionne parfaitement!');
    console.log('');
    console.log('🔍 Pour vérifier l\'OTP reçu, utilisez:');
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

// Informations utiles
function showInfo() {
  console.log('📋 Dashboards utiles:');
  console.log('');
  console.log('🔗 Supabase Dashboard:', 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn');
  console.log('🔧 Variables env:', 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/edge-functions');
  console.log('📱 Auth Hooks:', 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/auth/hooks');
  console.log('📊 Logs fonction:', 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/functions/sms-hook');
  console.log('🐝 TextBee Dashboard:', 'https://app.textbee.dev');
  console.log('');
}

// Exécution du test
console.log('🚀 Test d\'intégration SMS - Supabase + TextBee');
console.log('================================================');
console.log('');

showInfo();
testSMSAuth();
