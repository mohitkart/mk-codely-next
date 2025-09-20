// utils/crypto.server.ts
import envirnment from "@/envirnment";
import crypto from "crypto";
const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = crypto.createHash("sha256").update(String(envirnment.secret_key || "default_secret")).digest("base64").substring(0, 32);
const IV = crypto.randomBytes(16);

// Encrypt
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return IV.toString("hex") + ":" + encrypted.toString("hex");
}

// Decrypt
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  const iv = Buffer.from(parts.shift()!, "hex");
  const encrypted = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
