// @ts-nocheck — Jest-only setup file, runs in Node.js
const { TextEncoder, TextDecoder } = require("util");

Object.assign(globalThis, { TextEncoder, TextDecoder });
