import { Hono } from "hono";
import { cors } from "hono/cors";

// === ENVS ===
const requiredEnvs = [
  "FRONTEND_ORIGIN",
  "DB_URL",
  "ARGON_SECRET",
  "JWK_SIGN",
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
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : process.env.FRONTEND_ORIGIN,
  credentials: true,
});

const app = new Hono()
  .use("*", corsPolicy)
  .get("/", (ctx) => {
    return ctx.text("[GET] Hello, World!");
  })
  .post("/", (ctx) => {
    return ctx.text("[POST] Hello, World!");
  });

export type HonoApp = typeof app;

// === RUN SERVER ===
export default {
  port: 3000,
  fetch: app.fetch,
};
