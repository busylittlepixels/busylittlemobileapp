// Import URL and crypto polyfills
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

// Import our comprehensive Node.js polyfills
import { applyNodePolyfills } from './nodePolyfills';

// Apply Node.js polyfills
applyNodePolyfills();

// Import node-libs-react-native for any additional polyfills
import 'node-libs-react-native/globals';

// This file intentionally doesn't export anything
// It's meant to be imported for its side effects

console.log('[Polyfills] All polyfills loaded successfully'); 