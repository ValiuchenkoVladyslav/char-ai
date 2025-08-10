import { exportJWK, generateSecret } from "jose";

try {
  const JWK_SIGN = await generateSecret("HS512", { extractable: true });
  console.log(`JWK_SIGN:\n${JSON.stringify(await exportJWK(JWK_SIGN))}`);
} catch (error) {
  console.error("Failed to generate JWK sign key:", error);
  process.exit(1);
}
