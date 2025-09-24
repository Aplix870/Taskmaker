# ===============================
# Expo + Reanimated Nuclear Reset (with Hermes)
# ===============================

Write-Host "=== Cleaning node_modules and lock files ==="
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json,yarn.lock -ErrorAction SilentlyContinue

Write-Host "=== Removing .expo folder ==="
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

Write-Host "=== Reinstalling dependencies ==="
npm install

Write-Host "=== Prebuilding native projects (if needed) ==="
npx expo prebuild --clean

# Enable Hermes in android/app/build.gradle
$buildGradlePath = "android\app\build.gradle"
if (Test-Path $buildGradlePath) {
    (Get-Content $buildGradlePath) -replace '(enableHermes:\s*)false', '${1}true' | Set-Content $buildGradlePath
    Write-Host "=== Hermes enabled in build.gradle ==="
} else {
    Write-Host "=== Warning: build.gradle not found; skipping Hermes step ==="
}

Write-Host "=== Resetting Metro cache ==="
npx expo start -c

Write-Host "=== Done! ==="
Write-Host "Now you can run the app in Expo Go, or build Android:"
Write-Host "   npx expo run:android"
