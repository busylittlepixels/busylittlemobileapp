import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
import { decode, encode } from 'base-64';

export const polyfill = () => {
    // Use directly imported base-64 functions
    polyfillGlobal('atob', () => decode);
    polyfillGlobal('btoa', () => encode);
}; 