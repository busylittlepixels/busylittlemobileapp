import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
import { fetch, Headers, Request, Response } from 'react-native-fetch-api';

export const polyfill = () => {
    // Use directly imported fetch API instead of requiring
    polyfillGlobal('fetch', () => fetch);
    polyfillGlobal('Headers', () => Headers);
    polyfillGlobal('Request', () => Request);
    polyfillGlobal('Response', () => Response);
}; 