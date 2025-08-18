import { zValidator } from "@hono/zod-validator";
import { confirmEmailDto, signInDto, signUpDto } from "@repo/schema";
import { Hono } from "hono";
import { UserImage } from "./lib/user-image";
import { handleSignInForm, signInEmailPass } from "./services/sign-in";
import { handleSignUpForm, signUpEmailPass } from "./services/sign-up";

export const userController = new Hono()
  // SIGN UP
  .post("/sign-up", zValidator("form", signUpDto), async (ctx) => {
    const data = ctx.req.valid("form");

    // validate pfp
    const pfpBuffer = Buffer.from(await data.pfp.arrayBuffer());

    const pfpValidationRes = await UserImage.validatePfp(pfpBuffer);
    if (pfpValidationRes instanceof Error) {
      return ctx.text(`Invalid pfp! ${pfpValidationRes.message}`, 400);
    }

    return handleSignUpForm(ctx, data, pfpBuffer);
  })
  .post("/sign-up/confirm", zValidator("form", confirmEmailDto), (ctx) => {
    return signUpEmailPass(ctx, ctx.req.valid("form"));
  })
  // SIGN IN
  .post("/sign-in", zValidator("form", signInDto), (ctx) => {
    return handleSignInForm(ctx, ctx.req.valid("form"));
  })
  .post("/sign-in/confirm", zValidator("form", confirmEmailDto), (ctx) => {
    return signInEmailPass(ctx, ctx.req.valid("form"));
  });
