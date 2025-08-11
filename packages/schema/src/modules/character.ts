import { object, string, instanceof as z_instanceof } from "zod/v4";
import { base } from "../utils";

// === base ===
export const characterNameBase = base(3, 32);

export const descriptionBase = base(16, 256);

export const promptBase = base(16, 512);

// === schemas ===
export const characterNameSchema = string("Name must be a string!")
  .min(
    characterNameBase.minLen,
    `Must be at least ${characterNameBase.minLen} characters!`,
  )
  .max(
    characterNameBase.maxLen,
    `Must be at most ${characterNameBase.maxLen} characters!`,
  );

export const descriptionSchema = string("Description must be a string!")
  .min(
    descriptionBase.minLen,
    `Must be at least ${descriptionBase.minLen} characters!`,
  )
  .max(
    descriptionBase.maxLen,
    `Must be at most ${descriptionBase.maxLen} characters!`,
  );

export const promptSchema = string({ error: "Prompt must be a string!" })
  .min(promptBase.minLen, `Must be at least ${promptBase.minLen} characters!`)
  .max(promptBase.maxLen, `Must be at most ${promptBase.maxLen} characters!`);

// === dtos ===
export const pfpDto = z_instanceof(File).transform(async (val) =>
  Buffer.from(await val.arrayBuffer()),
);

export const coverImageDto = z_instanceof(File).transform(async (val) =>
  Buffer.from(await val.arrayBuffer()),
);

export const createCharacterDto = object({
  name: characterNameSchema,
  description: descriptionSchema,
  prompt: promptSchema,
  pfp: pfpDto,
  coverImage: coverImageDto,
});

export const updateCharacterDto = object({
  name: characterNameSchema.optional(),
  description: descriptionSchema.optional(),
  prompt: promptSchema.optional(),
  pfp: pfpDto.optional(),
  coverImage: coverImageDto.optional(),
});
