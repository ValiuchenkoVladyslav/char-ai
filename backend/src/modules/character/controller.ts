import { zValidator } from "@hono/zod-validator";
import { createCharacterDto, updateCharacterDto } from "@repo/schema";
import { Hono } from "hono";
import { fileToBuffer, isId } from "~/lib/utils";
import { authGuard } from "~/modules/user/middleware/auth-guard";
import { CharacterImage } from "./lib/character-image";
import { createCharacter } from "./services/create-character";
import { deleteCharacter } from "./services/delete-character";
import { getCharacter } from "./services/get-character";
import { updateCharacter } from "./services/update-character";

export const characterController = new Hono()
  // create new character
  .post(
    "/character",
    authGuard,
    zValidator("form", createCharacterDto),
    async (ctx) => {
      const data = ctx.req.valid("form");

      // validate images
      const pfpBuffer = await fileToBuffer(data.pfp);
      if (pfpBuffer instanceof Error) {
        return ctx.text("Invalid pfp!", 400);
      }

      const coverBuffer = await fileToBuffer(data.coverImage);
      if (coverBuffer instanceof Error) {
        return ctx.text("Invalid cover image!", 400);
      }

      const [pfpValidationRes, coverValidationRes] = await Promise.all([
        CharacterImage.validatePfp(pfpBuffer),
        CharacterImage.validateCover(coverBuffer),
      ]);

      if (pfpValidationRes instanceof Error) {
        return ctx.text(`Invalid pfp! ${pfpValidationRes.message}`, 400);
      }

      if (coverValidationRes instanceof Error) {
        return ctx.text(
          `Invalid cover image! ${coverValidationRes.message}`,
          400,
        );
      }

      return createCharacter(
        ctx,
        ctx.get("userId"),
        data,
        pfpBuffer,
        coverBuffer,
      );
    },
  )
  // get full character info
  .get("/character/:id", (ctx) => {
    const characterId = Number(ctx.req.param("id"));

    if (!isId(characterId)) {
      return ctx.text("Invalid character id!", 400);
    }

    return getCharacter(ctx, characterId);
  })
  // edit character
  .patch(
    "/character/:id",
    authGuard,
    zValidator("form", updateCharacterDto),
    async (ctx) => {
      const characterId = Number(ctx.req.param("id"));

      if (!isId(characterId)) {
        return ctx.text("Invalid character id!", 400);
      }

      // validate images
      const data = ctx.req.valid("form");

      let pfpBuffer: Buffer | undefined;
      if (data.pfp) {
        const pfpBufferRes = await fileToBuffer(data.pfp);
        if (pfpBufferRes instanceof Error) {
          return ctx.text("Invalid pfp!", 400);
        }

        pfpBuffer = pfpBufferRes;

        const res = await CharacterImage.validatePfp(pfpBuffer);

        if (res instanceof Error) {
          return ctx.text(`Invalid pfp! ${res.message}`, 400);
        }
      }

      let coverBuffer: Buffer | undefined;
      if (data.coverImage) {
        const coverBufferRes = await fileToBuffer(data.coverImage);
        if (coverBufferRes instanceof Error) {
          return ctx.text("Invalid cover image!", 400);
        }

        coverBuffer = coverBufferRes;

        const res = await CharacterImage.validateCover(coverBuffer);

        if (res instanceof Error) {
          return ctx.text(`Invalid cover image! ${res.message}`, 400);
        }
      }

      return updateCharacter(
        ctx,
        ctx.get("userId"),
        characterId,
        data,
        pfpBuffer,
        coverBuffer,
      );
    },
  )
  // delete character
  .delete("/character/:id", authGuard, (ctx) => {
    const characterId = Number(ctx.req.param("id"));

    if (!isId(characterId)) {
      return ctx.text("Invalid character id!", 400);
    }

    return deleteCharacter(ctx, ctx.get("userId"), characterId);
  });
