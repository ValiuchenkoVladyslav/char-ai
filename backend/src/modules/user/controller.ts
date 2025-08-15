import { zValidator } from "@hono/zod-validator";
import { signUpDto } from "@repo/schema";
import { Hono } from "hono";
import { handleSignUpForm, signUpEmailPass } from "./services/sign-up";

export const userController = new Hono()
  .post("/sign-up", zValidator("form", signUpDto), (ctx) => {
    return handleSignUpForm(ctx, ctx.req.valid("form"));
  })
  .post("/sign-up/confirm/:token", (ctx) => {
    return signUpEmailPass(ctx, ctx.req.param("token"));
  });
