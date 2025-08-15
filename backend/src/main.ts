import { Hono } from "hono";
import { cors } from "hono/cors";

import { authController } from "./modules/auth/controller";
import { characterController } from "./modules/character/controller";

// === ENVS ===
const requiredEnvs = [
  "FRONTEND_ORIGIN",

  "DB_URL",

  "SUPABASE_URL",
  "SUPABASE_KEY",

  "HMAC_SECRET",

  "RESEND_KEY",
  "RESEND_EMAIL_FROM",
] as const;

for (const envVar of requiredEnvs) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable not set!`);
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends Record<(typeof requiredEnvs)[number], string> {}
  }
}

// === HONO APP ===
const corsPolicy = cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
});

const app = new Hono()
  .use("*", corsPolicy)
  .route("/auth", authController)
  .route("/", characterController);

export type HonoApp = typeof app;

// === RUN SERVER ===
export default {
  port: 3000,
  fetch: app.fetch,
};
