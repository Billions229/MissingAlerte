# Script de vérification des prérequis pour le déploiement SMS Hook
# Usage: .\scripts\check-prerequisites.ps1

Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Green
Write-Host ""

$allGood = $true

# 1. Vérifier Supabase CLI
Write-Host "1. Supabase CLI..." -NoNewline
try {
    $version = supabase --version 2>$null
    Write-Host " ✅ Installé (version $version)" -ForegroundColor Green
} catch {
    Write-Host " ❌ Non installé" -ForegroundColor Red
    Write-Host "   Installez avec: scoop install supabase" -ForegroundColor Yellow
    $allGood = $false
}

# 2. Vérifier la connexion Supabase
Write-Host "2. Connexion Supabase..." -NoNewline
try {
    $projects = supabase projects list 2>$null
    if ($projects -match "wzixsqcamriroqavnhvn") {
        Write-Host " ✅ Connecté" -ForegroundColor Green
    } else {
        Write-Host " ❌ Non connecté au bon projet" -ForegroundColor Red
        Write-Host "   Connectez-vous avec: supabase login" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host " ❌ Non connecté" -ForegroundColor Red
    Write-Host "   Connectez-vous avec: supabase login" -ForegroundColor Yellow
    $allGood = $false
}

# 3. Vérifier le lien du projet
Write-Host "3. Projet lié..." -NoNewline
if (Test-Path ".\.supabase\config.toml") {
    Write-Host " ✅ Projet lié" -ForegroundColor Green
} else {
    Write-Host " ❌ Projet non lié" -ForegroundColor Red
    Write-Host "   Liez avec: supabase link --project-ref wzixsqcamriroqavnhvn" -ForegroundColor Yellow
    $allGood = $false
}

# 4. Vérifier la fonction SMS Hook
Write-Host "4. Fonction SMS Hook..." -NoNewline
if (Test-Path ".\supabase\functions\sms-hook\index.ts") {
    Write-Host " ✅ Fonction trouvée" -ForegroundColor Green
} else {
    Write-Host " ❌ Fonction non trouvée" -ForegroundColor Red
    $allGood = $false
}

# 5. Vérifier les fichiers de configuration
Write-Host "5. Fichiers de configuration..." -NoNewline
$configFiles = @(
    ".\supabase\functions\_shared\cors.ts",
    ".\supabase\functions\sms-hook\deno.json"
)

$missingFiles = @()
foreach ($file in $configFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host " ✅ Tous les fichiers présents" -ForegroundColor Green
} else {
    Write-Host " ❌ Fichiers manquants:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    $allGood = $false
}

Write-Host ""

# Résumé
if ($allGood) {
    Write-Host "🎉 Tous les prérequis sont satisfaits!" -ForegroundColor Green
    Write-Host "Vous pouvez maintenant déployer avec: .\scripts\deploy-sms-hook.ps1" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Certains prérequis ne sont pas satisfaits." -ForegroundColor Yellow
    Write-Host "Corrigez les problèmes ci-dessus avant de continuer." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Variables d'environnement à configurer dans Supabase:" -ForegroundColor Cyan
Write-Host "- TEXTBEE_API_KEY" -ForegroundColor White
Write-Host "- TEXTBEE_DEVICE_ID" -ForegroundColor White  
Write-Host "- TEXTBEE_BASE_URL" -ForegroundColor White
Write-Host "- APP_NAME" -ForegroundColor White
Write-Host "- SUPABASE_SMS_HOOK_SECRET (après création du hook)" -ForegroundColor White
