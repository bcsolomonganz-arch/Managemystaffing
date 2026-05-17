/**
 * Client-side encryption using Web Crypto API
 * AES-256-GCM for field-level encryption of PII (defense-in-depth)
 * SOC 2 CC6.1 — Encryption of sensitive data
 */

/**
 * Generate a session-only AES-256-GCM key (memory-only, never persisted)
 */
export async function generateSessionKey() {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable for export if needed
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive a key from password + salt using PBKDF2 (100k iterations, SHA-256)
 */
export async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const saltBuffer = typeof salt === 'string' ? encoder.encode(salt) : salt;

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext field value with AES-256-GCM
 * Returns base64(iv:ciphertext:tag) — all in one string
 */
export async function encryptField(plaintext, key) {
  if (!plaintext) return '';
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encoder.encode(plaintext)
  );

  // Combine IV + ciphertext (tag is appended by GCM)
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypt a field encrypted with encryptField
 */
export async function decryptField(encoded, key) {
  if (!encoded) return '';
  const combined = base64ToArrayBuffer(encoded);
  const combinedArray = new Uint8Array(combined);

  const iv = combinedArray.slice(0, 12);
  const ciphertext = combinedArray.slice(12);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

/**
 * Generate a random salt for key derivation
 */
export function generateSalt() {
  return arrayBufferToBase64(crypto.getRandomValues(new Uint8Array(16)).buffer);
}

// --- Utilities ---

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
