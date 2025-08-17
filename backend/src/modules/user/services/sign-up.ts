import { AuthMethod, type ConfirmEmailDto, type SignUpDto } from "@repo/schema";
import { eq, or } from "drizzle-orm";
import type { Context } from "hono";

import { Argon2, randomBase64 } from "~/lib/crypto";
import { sendEmail } from "~/lib/email";
import { db, redis } from "~/lib/storage";
import { userTbl } from "~/lib/storage/schema";
import { logErrWithFallback } from "~/lib/utils";
import type { AuthData } from "~/modules/auth/lib/auth-data";
import { Session } from "~/modules/auth/lib/session";

import { UserImage } from "../lib/user-image";

interface ProccessedSignUpData extends Omit<SignUpDto, "password"> {
  passwordHash: string;
  pfpUrl: string | null;
}

export async function handleSignUpForm(ctx: Context, signUpData: SignUpDto) {
  const taken = await db
    .select({ tag: userTbl.tag, email: userTbl.email })
    .from(userTbl)
    .where(
      or(eq(userTbl.email, signUpData.email), eq(userTbl.tag, signUpData.tag)),
    )
    .then((res) => res.at(0))
    .catch(
      logErrWithFallback(
        "Failed to check for existing user",
        new Error("Unknown error!"),
      ),
    );

  if (taken instanceof Error) {
    return ctx.text(taken.message, 500);
  }

  if (taken) {
    return ctx.text(
      signUpData.email === taken.email
        ? "Email already taken!"
        : "Username already taken!",
      400,
    );
  }

  const pfpUrl = signUpData.pfp
    ? await UserImage.uploadPfp(signUpData.pfp)
    : null;

  if (pfpUrl instanceof Error) {
    console.error("Failed to upload user pfp!", pfpUrl);
    return ctx.text(pfpUrl.message, 500);
  }

  const token = randomBase64(6); // we use 6 byte token instead of digit-only security code
  redis.setex(
    token,
    60 * 15,
    JSON.stringify({
      email: signUpData.email,
      tag: signUpData.tag,
      name: signUpData.name,
      passwordHash: Argon2.hash(signUpData.password),
      pfpUrl,
    } satisfies ProccessedSignUpData),
  );

  sendEmail(
    signUpData.email,
    "Sign-Up Security Code",
    `<h3>Your Security Code:</h3>\n<h2>${token}</h2><br/><p>Ignore this email if it wasn't you!</p>`,
  );

  return ctx.text("OK", 200);
}

export async function signUpEmailPass(
  ctx: Context,
  confirmData: ConfirmEmailDto,
) {
  const userData = await redis.getdel(confirmData.token);
  if (!userData) {
    return ctx.text("Invalid or expired confirmation code!", 400);
  }

  const data: ProccessedSignUpData = JSON.parse(userData);

  const res = await db
    .insert(userTbl)
    .values({
      tag: data.tag,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      authMethod: AuthMethod.EmailPass,
      pfpUrl: data.pfpUrl,
    })
    .returning({ id: userTbl.id })
    .then((res) => res.at(0))
    .catch(logErrWithFallback("Failed to create user", undefined));

  if (!res) {
    if (data.pfpUrl) {
      UserImage.remove([data.pfpUrl]).then((res) => {
        if (res.error) {
          console.error("Failed to remove user pfp!", res.error);
        }
      });
    }

    return ctx.text("Unknown error occurred!", 500);
  }

  await Session.create(ctx, res.id);

  return ctx.json(
    {
      id: res.id,
      name: data.name,
      email: data.email,
      pfpUrl: null,
    } satisfies AuthData,
    201,
  );
}
