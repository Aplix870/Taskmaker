const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Treat .wasm as an asset, not JS
config.resolver.assetExts.push("wasm");

module.exports = config;
