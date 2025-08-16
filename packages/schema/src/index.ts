// https://turborepo.com/blog/you-might-not-need-typescript-project-references#internal-typescript-packages

export {
  characterNameBase,
  characterNameSchema,
  createCharacterDto,
  descriptionBase,
  descriptionSchema,
  promptBase,
  promptSchema,
  updateCharacterDto,
} from "./modules/character";
export {
  AuthMethod,
  type ConfirmEmailDto,
  confirmEmailDto,
  emailBase,
  emailSchema,
  passwordBase,
  passwordSchema,
  pfpSchema,
  type SignUpDto,
  signUpDto,
  tagBase,
  tagSchema,
  userNameBase,
  userNameSchema,
} from "./modules/user";
