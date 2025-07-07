/**
 * Générateur de secret pour SMS Hook
 * Usage: node scripts/generate-hook-secret.js
 */

const crypto = require('crypto');

function generateSecureSecret() {
  // Générer un secret de 32 bytes (256 bits) en base64
  return crypto.randomBytes(32).toString('base64');
}

function showInstructions(secret) {
  console.log('🔐 Nouveau secret SMS Hook généré:');
  console.log('');
  console.log('Secret:', secret);
  console.log('');
  console.log('📋 Instructions de configuration:');
  console.log('');
  console.log('1. 🔧 Variables d\'environnement Supabase:');
  console.log('   - Allez sur: https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/edge-functions');
  console.log('   - Ajoutez/Modifiez: SMS_HOOK_SECRET =', secret);
  console.log('');
  console.log('2. 📱 Configuration SMS Hook:');
  console.log('   - Allez sur: https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/auth/hooks');
  console.log('   - Hook URL: https://wzixsqcamriroqavnhvn.supabase.co/functions/v1/sms-hook');
  console.log('   - Secret:', secret);
  console.log('   - Activez le hook (toggle ON)');
  console.log('');
  console.log('3. 🔄 Redéployer la fonction:');
  console.log('   supabase functions deploy sms-hook --no-verify-jwt');
  console.log('');
  console.log('4. 🧪 Tester l\'intégration:');
  console.log('   node scripts/test-sms-simple.js');
  console.log('');
  console.log('⚠️  Important: Utilisez exactement le même secret dans les deux endroits!');
}

// Générer et afficher le secret
const newSecret = generateSecureSecret();
showInstructions(newSecret);

// Sauvegarder dans un fichier pour référence
const fs = require('fs');
const secretInfo = {
  secret: newSecret,
  generated_at: new Date().toISOString(),
  instructions: {
    supabase_env_vars: 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/settings/edge-functions',
    auth_hooks: 'https://supabase.com/dashboard/project/wzixsqcamriroqavnhvn/auth/hooks',
    hook_url: 'https://wzixsqcamriroqavnhvn.supabase.co/functions/v1/sms-hook'
  }
};

fs.writeFileSync('sms-hook-secret.json', JSON.stringify(secretInfo, null, 2));
console.log('💾 Secret sauvegardé dans: sms-hook-secret.json');
console.log('');
console.log('🎯 Prochaines étapes:');
console.log('1. Copiez le secret ci-dessus');
console.log('2. Configurez-le dans Supabase (variables env + auth hooks)');
console.log('3. Redéployez la fonction');
console.log('4. Testez l\'intégration');
