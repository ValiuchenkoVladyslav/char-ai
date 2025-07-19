/**
 * Script to generate JWK keys for JWT signing and encryption.
 * 
 * SECURITY WARNING:
 * - Run this script in a secure environment
 * - Store the generated keys securely (environment variables, secrets manager)
 * - Never commit these keys to version control
 * - Rotate keys periodically
 */

import { exportJWK, generateSecret } from "jose";

try {
  const JWK_SIGN = await generateSecret("HS512", { extractable: true });
  console.log("JWK_SIGN:\n" + JSON.stringify(await exportJWK(JWK_SIGN)));

  const JWK_ENCRYPT = await generateSecret("A256GCMKW", { extractable: true });
  console.log("JWK_ENCRYPT:\n" + JSON.stringify(await exportJWK(JWK_ENCRYPT)));
} catch (error) {
  console.error("Failed to generate JWK keys:", error);
  process.exit(1);
}
