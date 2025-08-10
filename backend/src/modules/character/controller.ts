import { zValidator } from "@hono/zod-validator";
import { createCharacterDto, updateCharacterDto } from "@repo/schema";
import { Hono } from "hono";
import { createCharacter } from "./services/create-character";
import { deleteCharacter } from "./services/delete-character";
import { getCharacter } from "./services/get-character";
import { updateCharacter } from "./services/update-character";

export const characterController = new Hono()
  // create new character (TODO AUTH MIDDLEWARE)
  .post("/character", zValidator("json", createCharacterDto), (ctx) => {
    return createCharacter(ctx, 1, ctx.req.valid("json"));
  })
  // get full character info
  .get("/character/:id", (ctx) => {
    const id = Number(ctx.req.param("id"));

    if (Number.isNaN(id) || id < 1) {
      return ctx.text("Invalid character id!", 400);
    }

    return getCharacter(ctx, id);
  })
  // edit character (TODO AUTH MIDDLEWARE)
  .patch("/character/:id", zValidator("json", updateCharacterDto), (ctx) => {
    const id = Number(ctx.req.param("id"));

    if (Number.isNaN(id) || id < 1) {
      return ctx.text("Invalid character id!", 400);
    }

    return updateCharacter(ctx, 1, id, ctx.req.valid("json"));
  })
  // delete character (TODO AUTH MIDDLEWARE)
  .delete("/character/:id", (ctx) => {
    const id = Number(ctx.req.param("id"));

    if (Number.isNaN(id) || id < 1) {
      return ctx.text("Invalid character id!", 400);
    }

    return deleteCharacter(ctx, 1, id);
  });
