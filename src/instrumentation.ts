const requiredEnvs = [
  "DB_URL",
  "REDIS_URL",
  "REDIS_TOKEN",
  "JWT_SECRET_ENCODE",
  "JWT_SECRET_DECODE",
  "NEXT_PUBLIC_OAUTH2_CLIENT_ID",
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
