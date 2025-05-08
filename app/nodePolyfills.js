/**
 * Comprehensive Node.js Polyfills for React Native
 * This file creates mock implementations for all Node.js core modules
 * that might be required by libraries but aren't available in React Native.
 */

// Import actual polyfills we have installed
import EventEmitter from 'events';
import { decode as atob, encode as btoa } from 'base-64';
import { ReadableStream } from 'web-streams-polyfill';
import 'react-native-get-random-values';

// Create a simple mock Socket for modules that need it
class Socket extends EventEmitter {
  constructor(options) {
    super();
    this.connecting = false;
    this.destroyed = false;
  }
  
  connect() {
    setTimeout(() => this.emit('connect'), 0);
    return this;
  }
  
  end() { return this; }
  destroy() { return this; }
  setTimeout() { return this; }
  setKeepAlive() { return this; }
  setNoDelay() { return this; }
}

// Helper for creating HTTP request/response objects
function createHttpModule() {
  // Create a simple request object
  function createRequest(options, cb) {
    const req = new EventEmitter();
    req.end = () => {
      setTimeout(() => {
        const res = new EventEmitter();
        res.statusCode = 200;
        res.headers = {};
        if (cb) cb(res);
        res.emit('data', Buffer.from('{}'));
        res.emit('end');
      }, 0);
    };
    return req;
  }
  
  // Create a simple get shorthand
  function httpGet(url, cb) {
    const req = createRequest(url, cb);
    req.end();
    return req;
  }
  
  return {
    request: createRequest,
    get: httpGet
  };
}

// Mock Buffer implementation if not provided
if (!global.Buffer) {
  global.Buffer = {
    from: (data, encoding) => {
      if (typeof data === 'string') {
        return Uint8Array.from(data, c => c.charCodeAt(0));
      }
      return new Uint8Array(data);
    },
    alloc: size => new Uint8Array(size),
    allocUnsafe: size => new Uint8Array(size),
    isBuffer: obj => obj instanceof Uint8Array
  };
}

// Add all the polyfills to the global object
const polyfills = {
  // Core globals
  process: {
    env: {},
    nextTick: fn => setTimeout(fn, 0),
    browser: true
  },
  
  // Core modules
  events: { EventEmitter },
  
  buffer: {
    Buffer: global.Buffer
  },
  
  // Add OS module
  os: {
    hostname: () => 'localhost',
    type: () => 'React Native',
    platform: () => 'react-native',
    arch: () => 'unknown',
    release: () => 'unknown',
    networkInterfaces: () => ({}),
    cpus: () => [],
    totalmem: () => 1024 * 1024 * 1024, // 1GB
    freemem: () => 512 * 1024 * 1024,   // 512MB
    userInfo: () => ({
      uid: -1,
      gid: -1,
      username: 'react-native-user',
      homedir: '/',
      shell: null
    }),
    tmpdir: () => '/tmp',
    endianness: () => 'LE',
    EOL: '\n'
  },
  
  stream: {
    Readable: class extends EventEmitter {
      pipe() { return this; }
      read() { return null; }
    },
    Writable: class extends EventEmitter {
      write() { return true; }
      end() { return this; }
    },
    Duplex: class extends EventEmitter {
      pipe() { return this; }
      write() { return true; }
      read() { return null; }
      end() { return this; }
    }
  },
  
  string_decoder: {
    StringDecoder: class {
      write(buffer) { return buffer.toString(); }
      end() { return ''; }
    }
  },
  
  url: {
    parse: url => new URL(url),
    resolve: (from, to) => new URL(to, from).href
  },
  
  assert: {
    ok: () => {},
    equal: () => {},
    strictEqual: () => {},
    deepEqual: () => {},
    // Add other assert methods as needed
  },
  
  crypto: {
    randomBytes: size => new Uint8Array(size),
    createHash: () => ({
      update: () => ({ digest: () => 'mock-hash' })
    }),
    // Add other crypto methods as needed
  },
  
  fs: {
    readFileSync: () => '',
    writeFileSync: () => {},
    existsSync: () => false,
    // Add other fs methods as needed
  },

  path: {
    join: (...args) => args.join('/'),
    resolve: (...args) => args.join('/'),
    dirname: path => path.split('/').slice(0, -1).join('/'),
    basename: path => path.split('/').pop(),
    // Add other path methods as needed
  },
  
  net: {
    Socket,
    createConnection: () => new Socket(),
    isIP: () => 0,
    isIPv4: () => false,
    isIPv6: () => false
  },
  
  tls: {
    TLSSocket: class extends Socket {
      constructor() {
        super();
        this.authorized = true;
        this.encrypted = true;
      }
      getPeerCertificate() { return {}; }
    },
    connect: () => new Socket(),
    createServer: () => ({
      listen: () => ({}),
      close: () => ({})
    })
  },
  
  // Create HTTP and HTTPS modules without circular references
  http: createHttpModule(),
  https: createHttpModule(),
  
  zlib: {
    createGzip: () => new polyfills.stream.Duplex(),
    createGunzip: () => new polyfills.stream.Duplex(),
    gzip: (data, cb) => cb(null, data),
    gunzip: (data, cb) => cb(null, data),
    // Add other zlib methods as needed
  },
  
  querystring: {
    stringify: obj => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    },
    parse: str => {
      return str.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        acc[key] = value;
        return acc;
      }, {});
    }
  },
  
  dgram: {
    createSocket: () => ({
      bind: () => {},
      on: () => {},
      send: () => {}
    })
  },
  
  // WebSocket implementation compatible with ws library
  WebSocket: class extends EventEmitter {
    constructor(url, protocols) {
      super();
      this.url = url;
      this.readyState = 0; // CONNECTING
      setTimeout(() => {
        this.readyState = 1; // OPEN
        this.emit('open');
      }, 0);
    }
    
    send(data) { return true; }
    close() {
      this.readyState = 3; // CLOSED
      this.emit('close');
    }
  }
};

// Make sure WebSocket has the correct constants
polyfills.WebSocket.CONNECTING = 0;
polyfills.WebSocket.OPEN = 1;
polyfills.WebSocket.CLOSING = 2;
polyfills.WebSocket.CLOSED = 3;

// Apply the polyfills to the global object
export function applyNodePolyfills() {
  if (!global.process) global.process = polyfills.process;
  
  // Add encoding/decoding functions
  if (!global.atob) global.atob = atob;
  if (!global.btoa) global.btoa = btoa;
  
  // Add ReadableStream
  if (!global.ReadableStream) global.ReadableStream = ReadableStream;
  
  // Add EventEmitter
  if (!global.EventEmitter) global.EventEmitter = EventEmitter;
  
  // Add WebSocket if not available
  if (!global.WebSocket) global.WebSocket = polyfills.WebSocket;
  
  // Create a mock require function for Node.js modules
  if (!global.__nativeRequire) global.__nativeRequire = global.require || (() => {});
  global.require = moduleName => {
    // Return our polyfilled modules
    if (polyfills[moduleName]) return polyfills[moduleName];
    
    // Try the native require as fallback
    try {
      return global.__nativeRequire(moduleName);
    } catch (e) {
      // Return an empty object as last resort to prevent crashes
      console.warn(`Module "${moduleName}" not found, using empty mock`);
      return {};
    }
  };
  
  // Log successful polyfill application for debugging
  console.log('Node.js polyfills applied successfully');
}

// Export the polyfills for direct use if needed
export default polyfills; 