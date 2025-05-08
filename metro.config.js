const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Instead of mapping individual modules, let's resolve all Node.js modules to our nodePolyfills implementation
const nodeModules = [
  'events', 'buffer', 'stream', 'string_decoder', 'url', 'assert', 'crypto',
  'fs', 'path', 'net', 'tls', 'http', 'https', 'zlib', 'querystring', 'dgram', 'os'
];

// We can now delete our individual polyfill files for these modules
config.resolver.extraNodeModules = nodeModules.reduce((acc, name) => {
  acc[name] = __dirname + '/app/nodePolyfills.js';
  return acc;
}, {});

module.exports = config; 