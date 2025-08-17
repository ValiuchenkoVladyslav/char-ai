import { zValidator } from "@hono/zod-validator";
import { confirmEmailDto, signUpDto } from "@repo/schema";
import { Hono } from "hono";
import { UserImage } from "./lib/user-image";
import { handleSignUpForm, signUpEmailPass } from "./services/sign-up";

export const userController = new Hono()
  .post("/sign-up", zValidator("form", signUpDto), async (ctx) => {
    const data = ctx.req.valid("form");

    // validate pfp
    if (data.pfp) {
      const pfpValidationRes = await UserImage.validatePfp(data.pfp);
      if (pfpValidationRes instanceof Error) {
        return ctx.text(`Invalid pfp! ${pfpValidationRes.message}`, 400);
      }
    }

    return handleSignUpForm(ctx, data);
  })
  .post("/sign-up/confirm", zValidator("form", confirmEmailDto), (ctx) => {
    return signUpEmailPass(ctx, ctx.req.valid("form"));
  });
