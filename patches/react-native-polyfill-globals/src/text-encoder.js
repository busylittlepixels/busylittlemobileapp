import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
import { TextEncoder, TextDecoder } from 'text-encoding';

export const polyfill = () => {
    // Use directly imported TextEncoder and TextDecoder
    polyfillGlobal('TextEncoder', () => TextEncoder);
    polyfillGlobal('TextDecoder', () => TextDecoder);
}; 