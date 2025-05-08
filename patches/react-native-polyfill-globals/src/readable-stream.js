import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
import { ReadableStream } from 'web-streams-polyfill';

export const polyfill = () => {
    // Use directly imported ReadableStream instead of requiring from specific path
    polyfillGlobal('ReadableStream', () => ReadableStream);
}; 