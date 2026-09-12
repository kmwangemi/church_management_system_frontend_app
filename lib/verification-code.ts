import crypto from 'node:crypto';

/**
 * Generate a 6-digit verification code using Math.random()
 * Simple and sufficient for most use cases
 */
export function generateVerificationCode(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/**
 * Generate a cryptographically secure 6-digit verification code
 * More secure option using Node.js crypto module
 */
export function generateSecureVerificationCode(): string {
  // Generate random bytes and convert to number
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);
  // Ensure it's a 6-digit number
  const code = (randomNumber % 900_000) + 100_000;
  return code.toString();
}

/**
 * Generate verification code with custom length
 * @param length - Length of the verification code (default: 6)
 */
export function generateVerificationCodeWithLength(length = 6): string {
  if (length < 1) {
    throw new Error('Length must be at least 1');
  }
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Generate alphanumeric verification code
 * @param length - Length of the code (default: 6)
 */
export function generateAlphanumericCode(length = 6): string {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Generate verification code excluding confusing characters
 * Excludes: 0, O, 1, I, l to prevent user confusion
 */
export function generateUserFriendlyCode(length = 6): string {
  const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Generate verification code with expiry timestamp
 * Returns both the code and expiry date
 */
export function generateVerificationCodeWithExpiry(expiryMinutes = 10): {
  code: string;
  expiresAt: Date;
} {
  const code = generateSecureVerificationCode();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  return { code, expiresAt };
}

/**
 * Validate if a verification code format is correct
 * @param code - The code to validate
 * @param expectedLength - Expected length (default: 6)
 */
export function isValidCodeFormat(code: string, expectedLength = 6): boolean {
  if (!code || typeof code !== 'string') return false;
  // Check if it's exactly the expected length and contains only digits
  const digitRegex = new RegExp(`^\\d{${expectedLength}}$`);
  return digitRegex.test(code);
}

/**
 * Check if verification code has expired
 * @param expiresAt - Expiration timestamp
 */
export function isCodeExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Generate multiple unique verification codes
 * Useful for batch operations or testing
 */
export function generateMultipleCodes(count: number): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generateSecureVerificationCode());
  }
  return Array.from(codes);
}

// Example usage:
/*
// Basic 6-digit code
const code1 = generateVerificationCode(); // "123456"

// Cryptographically secure code
const code2 = generateSecureVerificationCode(); // "789012"

// Custom length
const code3 = generateVerificationCodeWithLength(4); // "5678"

// Alphanumeric
const code4 = generateAlphanumericCode(8); // "A3B7K9M2"

// User-friendly (no confusing characters)
const code5 = generateUserFriendlyCode(6); // "A3B7K9"

// With expiry
const { code: code6, expiresAt } = generateVerificationCodeWithExpiry(15); // 15 minutes

// Rate-limited generation
const result = CodeGenerator.generateWithRateLimit("user@example.com");
if (result.success) {
  console.log("Generated code:", result.code);
} else {
  console.log("Wait", result.remainingTime, "seconds");
}

// Validation
const isValid = isValidCodeFormat("123456"); // true
const isExpired = isCodeExpired(expiresAt); // false (if within 15 minutes)
*/
