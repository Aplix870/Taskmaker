# Remove dependencies and caches
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json,yarn.lock -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo

# Reinstall dependencies
npm install

# Clean native builds (Android/iOS)
npx expo prebuild --clean

# Start Expo with cache cleared
npx expo start -c
