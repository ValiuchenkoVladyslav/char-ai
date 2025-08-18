const requiredEnvs = [
  "NEXT_PUBLIC_BACKEND_ORIGIN",
  "NEXT_PUBLIC_OAUTH2_CLIENT_ID",
] as const;
export function register() {
  for (const envVar of requiredEnvs) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} environment variable not set!`);
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends Record<(typeof requiredEnvs)[number], string> {}
  }
}
