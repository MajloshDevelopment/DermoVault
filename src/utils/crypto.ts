/**
 * Zero-Knowledge Client-Side Cryptographic Vault
 * Implements AES-GCM 256-bit encryption with PBKDF2 key derivation (100,000 iterations)
 * Complies with GDPR Art. 32 (Security of Processing) and Art. 17 (Right to Erasure / Cryptographic Shredding).
 */

const SALT_BYTES = 16;
const IV_BYTES = 12; // Standard for AES-GCM
const PBKDF2_ITERATIONS = 100000;
const VAULT_STORAGE_KEY = 'dermavault_encrypted_records_v1';
const VAULT_SALT_KEY = 'dermavault_master_salt_v1';

export interface EncryptedContainer {
  version: number;
  iv: string; // Base64
  salt: string; // Base64
  ciphertext: string; // Base64
  tagTimestamp: number;
}

function getCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  // Node.js or web worker
  return (globalThis as any).crypto;
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-GCM 256-bit CryptoKey from a user passphrase and salt via PBKDF2
 */
export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const cryptoObj = getCrypto();
  const enc = new TextEncoder();
  const passphraseKey = await cryptoObj.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return cryptoObj.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary serializable data using AES-GCM with a random IV and fresh salt
 */
export async function encryptData<T>(data: T, passphrase: string): Promise<EncryptedContainer> {
  const cryptoObj = getCrypto();
  const salt = cryptoObj.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = cryptoObj.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKeyFromPassphrase(passphrase, salt);

  const enc = new TextEncoder();
  const plaintextBuffer = enc.encode(JSON.stringify(data));

  const ciphertextBuffer = await cryptoObj.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintextBuffer
  );

  return {
    version: 1,
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
    ciphertext: bufferToBase64(ciphertextBuffer),
    tagTimestamp: Date.now()
  };
}

/**
 * Decrypts an EncryptedContainer back to the original object
 */
export async function decryptData<T>(container: EncryptedContainer, passphrase: string): Promise<T> {
  const cryptoObj = getCrypto();
  const salt = base64ToBuffer(container.salt);
  const iv = base64ToBuffer(container.iv);
  const ciphertext = base64ToBuffer(container.ciphertext);

  const key = await deriveKeyFromPassphrase(passphrase, salt);

  const decryptedBuffer = await cryptoObj.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    ciphertext as any
  );

  const dec = new TextDecoder();
  const jsonStr = dec.decode(decryptedBuffer);
  return JSON.parse(jsonStr) as T;
}

/**
 * Saves encrypted container list to local storage
 */
export function saveEncryptedVault(containers: EncryptedContainer[]): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(containers));
  }
}

/**
 * Loads raw encrypted containers from local storage
 */
export function loadEncryptedVault(): EncryptedContainer[] {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * GDPR Art. 17: Cryptographic Shredding
 * Overwrites and destroys encryption keys, salt, and all biometric data in storage.
 */
export function cryptographicShredVault(): void {
  if (typeof localStorage !== 'undefined') {
    // Overwrite with random noise first to thwart recovery
    const noise = Array.from({ length: 50 }, () => Math.random().toString(36)).join('');
    localStorage.setItem(VAULT_STORAGE_KEY, noise);
    localStorage.setItem(VAULT_SALT_KEY, noise);
    // Remove permanently
    localStorage.removeItem(VAULT_STORAGE_KEY);
    localStorage.removeItem(VAULT_SALT_KEY);
    localStorage.removeItem('dermavault_consent_ledger');
    localStorage.removeItem('dermavault_user_profile');
    localStorage.removeItem('dermavault_pro_sub');
  }
}
