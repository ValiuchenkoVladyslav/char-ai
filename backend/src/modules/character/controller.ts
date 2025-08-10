import { Hono } from "hono";

import { Slug } from "./lib/slug";

import { getCharacter } from "./services/get-character";

export const characterController = new Hono().get("/character/:slug", (ctx) => {
  const slug = Slug.decode(ctx.req.param("slug"));

  if (!slug) {
    return ctx.text("Invalid slug!", 400);
  }

  return getCharacter(ctx, slug.id);
});
