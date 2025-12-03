import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private static readonly SECRET_KEY = '0123456789ABCDEF0123456789ABCDEF';

  constructor() {}

  encrypt(value: string | null): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(
        String(value),
        CryptoService.SECRET_KEY
      ).toString();

      return encrypted;
    } catch (err) {
      console.error("Encryption failed:", err);
      return null;
    }
  }

  decrypt(cipherText: string | null): string | null {
    if (!cipherText) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(
        cipherText,
        CryptoService.SECRET_KEY
      );

      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (err) {
      console.error("Decryption failed:", err);
      return null;
    }
  }



  // // Must match Java SECRET_KEY exactly (32 chars = 256-bit)
  // private static readonly SECRET_KEY = '0123456789ABCDEF0123456789ABCDEF';
  // private static readonly IV_LENGTH = 12; // bytes
  // private static readonly GCM_TAG_LENGTH = 128; // bits
  //
  // private keyPromise: Promise<CryptoKey>;
  //
  // constructor() {
  //   this.keyPromise = this.importKey(CryptoService.SECRET_KEY);
  // }
  //
  // // Import raw key (same UTF-8 bytes as in Java)
  // private async importKey(secret: string): Promise<CryptoKey> {
  //   if (!secret) {
  //     console.log("Secret key cannot be empty");
  //   }
  //
  //   const cryptoObj = window?.crypto;
  //   const subtle = cryptoObj?.subtle;
  //
  //   if (!subtle || !cryptoObj) {
  //     console.log("Web Crypto API is not available in this environment.");
  //   }
  //
  //   const enc = new TextEncoder();
  //   const keyBytes = enc.encode(secret);
  //   try {
  //     return await subtle.importKey(
  //       'raw',
  //       keyBytes,
  //       { name: 'AES-GCM' },
  //       false,
  //       ['encrypt', 'decrypt']
  //     );
  //   } catch (err) {
  //     console.error("Key import failed:", err);
  //     throw err;
  //   }
  // }
  //
  // // --------- Public API ----------
  //
  // async encrypt(plain: string | null): Promise<string | null> {
  //   if (plain == null|| plain === '') {
  //     return null;
  //   }
  //
  //   const subtle = window?.crypto?.subtle;
  //   const cryptoObj = window?.crypto;
  //
  //   if (!subtle || !cryptoObj) {
  //     console.error("Web Crypto API while encryption is not available in this environment.");
  //     return null;
  //   }
  //
  //   const key = await this.keyPromise;
  //
  //   // Generate random 12-byte IV, same as Java
  //   const iv = crypto.getRandomValues(new Uint8Array(CryptoService.IV_LENGTH));
  //
  //   const encoder = new TextEncoder();
  //   const plainBytes = encoder.encode(plain);
  //
  //   const cipherBuffer = await subtle.encrypt(
  //     {
  //       name: 'AES-GCM',
  //       iv,
  //       tagLength: CryptoService.GCM_TAG_LENGTH
  //     },
  //     key,
  //     plainBytes
  //   );
  //
  //   const cipherBytes = new Uint8Array(cipherBuffer);
  //
  //   // combined = IV || cipherBytes (same layout as Java)
  //   const combined = new Uint8Array(iv.length + cipherBytes.length);
  //   combined.set(iv, 0);
  //   combined.set(cipherBytes, iv.length);
  //
  //   // Base64 encode combined
  //   return this.arrayBufferToBase64(combined.buffer);
  // }
  //
  // async decrypt(encryptedBase64: string | null): Promise<string | null> {
  //   if (encryptedBase64 == null) {
  //     return null;
  //   }
  //   const subtle = window?.crypto?.subtle;
  //   const cryptoObj = window?.crypto;
  //
  //   if (!subtle || !cryptoObj) {
  //     console.error("Web Crypto API decryption is not available in this environment.");
  //     return null;
  //   }
  //
  //   const key = await this.keyPromise;
  //
  //   const combinedBytes = this.base64ToUint8Array(encryptedBase64);
  //   if (combinedBytes.length < CryptoService.IV_LENGTH) {
  //     throw new Error('Invalid encrypted data');
  //   }
  //
  //   // Split into IV and cipherBytes
  //   const iv = combinedBytes.slice(0, CryptoService.IV_LENGTH);
  //   const cipherBytes = combinedBytes.slice(CryptoService.IV_LENGTH);
  //
  //   let plainBuffer: ArrayBuffer;
  //
  //   try {
  //     plainBuffer = await subtle.decrypt(
  //       {
  //         name: 'AES-GCM',
  //         iv,
  //         tagLength: CryptoService.GCM_TAG_LENGTH
  //       },
  //       key,
  //       cipherBytes
  //     );
  //   } catch (err) {
  //     console.error("Decryption failed:", err);
  //     return null;
  //   }
  //
  //   const decoder = new TextDecoder();
  //   return decoder.decode(plainBuffer); // UTF-8 string, same as Java
  // }
  //
  // // --------- Helpers ----------
  //
  // private arrayBufferToBase64(buffer: ArrayBuffer): string {
  //   const bytes = new Uint8Array(buffer);
  //   let binary = '';
  //   for (let i = 0; i < bytes.length; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // }
  //
  // private base64ToUint8Array(base64: string): Uint8Array {
  //   const binary = atob(base64);
  //   const bytes = new Uint8Array(binary.length);
  //   for (let i = 0; i < binary.length; i++) {
  //     bytes[i] = binary.charCodeAt(i);
  //   }
  //   return bytes;
  // }
}
