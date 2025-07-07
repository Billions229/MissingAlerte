# Script de déploiement pour la fonction SMS Hook
# Usage: .\scripts\deploy-sms-hook.ps1

Write-Host "🚀 Déploiement de la fonction SMS Hook..." -ForegroundColor Green
Write-Host ""

# Vérifier que Supabase CLI est installé
try {
    $version = supabase --version
    Write-Host "✅ Supabase CLI version: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI n'est pas installé ou accessible" -ForegroundColor Red
    Write-Host "Installez-le avec: scoop install supabase" -ForegroundColor Yellow
    exit 1
}

# Vérifier que le projet est lié
if (-not (Test-Path ".\.supabase\config.toml")) {
    Write-Host "❌ Projet non lié à Supabase" -ForegroundColor Red
    Write-Host "Exécutez: supabase link --project-ref wzixsqcamriroqavnhvn" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Projet lié à Supabase" -ForegroundColor Green

# Vérifier que la fonction existe
if (-not (Test-Path ".\supabase\functions\sms-hook\index.ts")) {
    Write-Host "❌ Fonction SMS Hook non trouvée" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fonction SMS Hook trouvée" -ForegroundColor Green
Write-Host ""

# Déployer la fonction
Write-Host "📦 Déploiement en cours..." -ForegroundColor Yellow
try {
    supabase functions deploy sms-hook --no-verify-jwt
    Write-Host ""
    Write-Host "✅ Fonction déployée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URL de la fonction:" -ForegroundColor Cyan
    Write-Host "https://wzixsqcamriroqavnhvn.supabase.co/functions/v1/sms-hook" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Configurer le SMS Hook dans Supabase Dashboard" -ForegroundColor White
    Write-Host "2. Ajouter SUPABASE_SMS_HOOK_SECRET aux variables d'environnement" -ForegroundColor White
    Write-Host "3. Tester l'intégration" -ForegroundColor White
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du déploiement:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "- Vérifiez votre connexion internet" -ForegroundColor White
    Write-Host "- Vérifiez que vous êtes connecté: supabase login" -ForegroundColor White
    Write-Host "- Vérifiez les logs: supabase functions logs sms-hook" -ForegroundColor White
    exit 1
}
