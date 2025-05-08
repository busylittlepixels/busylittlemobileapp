// Direct polyfill for WebSocket and related dependencies used by @supabase/realtime-js
const EventEmitter = require('events');

// Ensure EventEmitter is globally available
if (typeof global !== 'undefined' && !global.EventEmitter) {
    global.EventEmitter = EventEmitter;
}

// Export the EventEmitter for direct imports
module.exports = EventEmitter; 