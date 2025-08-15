import { randomBytes } from "crypto";
import { hmac } from "~/lib/crypto";
import { isId } from "~/lib/utils";

export namespace AuthToken {
  export function create(userId: number) {
    return `${userId}-${randomBytes(16).toString("base64")}`;
  }

  export function getUserId(token: string) {
    const idx = token.indexOf("-");

    if (idx === -1) {
      return null;
    }

    const userId = Number(token.substring(0, idx));

    if (!isId(userId)) {
      return null;
    }

    return userId;
  }

  export function hash(token: string) {
    return hmac(token).toString("base64");
  }
}
