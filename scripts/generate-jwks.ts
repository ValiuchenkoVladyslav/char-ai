import { exportJWK, generateSecret } from "jose";

const JWK_SIGN = await generateSecret("HS512", { extractable: true });
console.log("JWK_SIGN:\n" + JSON.stringify(await exportJWK(JWK_SIGN)));

const JWK_ENCRYPT = await generateSecret("A256GCMKW", { extractable: true });
console.log("JWK_ENCRYPT:\n" + JSON.stringify(await exportJWK(JWK_ENCRYPT)));
