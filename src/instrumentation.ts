const requiredEnvs = [
  "DB_URL",
  "REDIS_URL",
  "REDIS_TOKEN",
  "NEXT_PUBLIC_OAUTH2_CLIENT_ID",
  "RESEND_KEY",
  "ARGON2_SECRET",
  "JWK_SIGN",
  "JWK_ENCRYPT",
] as const;

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends Record<(typeof requiredEnvs)[number], string> {}
  }
}

export function register() {
  // check envs
  for (const envVar of requiredEnvs) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} environment variable not set!`);
    }
  }
}
