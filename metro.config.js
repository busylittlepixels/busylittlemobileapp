const { getDefaultConfig } = require('expo/metro-config');

// Get the default config
const config = getDefaultConfig(__dirname);

// Node.js polyfills for React Native
const nodeModules = [
  'events', 'buffer', 'stream', 'string_decoder', 'url', 'assert', 'crypto',
  'fs', 'path', 'net', 'tls', 'http', 'https', 'zlib', 'querystring', 'dgram', 'os'
];

// Configure polyfills
config.resolver.extraNodeModules = nodeModules.reduce((acc, name) => {
  acc[name] = __dirname + '/app/nodePolyfills.js';
  return acc;
}, {});

// New Architecture configurations
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.transformer.hermesEnabled = true;

// For JSI debugging
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config; 