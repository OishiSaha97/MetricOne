import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {


  // Must match Java SECRET_KEY exactly (32 chars = 256-bit)
  private static readonly SECRET_KEY = '0123456789ABCDEF0123456789ABCDEF';
  private static readonly IV_LENGTH = 12; // bytes
  private static readonly GCM_TAG_LENGTH = 128; // bits

  private keyPromise: Promise<CryptoKey>;

  constructor() {
    this.keyPromise = this.importKey(CryptoService.SECRET_KEY);
  }

  // Import raw key (same UTF-8 bytes as in Java)
  private async importKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyBytes = enc.encode(secret); // 32 bytes
    return crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // --------- Public API ----------

  async encrypt(plain: string | null): Promise<string | null> {
    if (plain == null) {
      return null;
    }

    const key = await this.keyPromise;

    // Generate random 12-byte IV, same as Java
    const iv = crypto.getRandomValues(new Uint8Array(CryptoService.IV_LENGTH));

    const encoder = new TextEncoder();
    const plainBytes = encoder.encode(plain);

    const cipherBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: CryptoService.GCM_TAG_LENGTH
      },
      key,
      plainBytes
    );

    const cipherBytes = new Uint8Array(cipherBuffer);

    // combined = IV || cipherBytes (same layout as Java)
    const combined = new Uint8Array(iv.length + cipherBytes.length);
    combined.set(iv, 0);
    combined.set(cipherBytes, iv.length);

    // Base64 encode combined
    return this.arrayBufferToBase64(combined.buffer);
  }

  async decrypt(encryptedBase64: string | null): Promise<string | null> {
    if (encryptedBase64 == null) {
      return null;
    }

    const key = await this.keyPromise;

    const combinedBytes = this.base64ToUint8Array(encryptedBase64);
    if (combinedBytes.length < CryptoService.IV_LENGTH) {
      throw new Error('Invalid encrypted data');
    }

    // Split into IV and cipherBytes
    const iv = combinedBytes.slice(0, CryptoService.IV_LENGTH);
    const cipherBytes = combinedBytes.slice(CryptoService.IV_LENGTH);

    const plainBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: CryptoService.GCM_TAG_LENGTH
      },
      key,
      cipherBytes
    );

    const decoder = new TextDecoder();
    return decoder.decode(plainBuffer); // UTF-8 string, same as Java
  }

  // --------- Helpers ----------

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
