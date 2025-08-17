import { randomBase64 } from "~/lib/crypto";
import { Image } from "~/lib/image";
import { s3 } from "~/lib/storage";

const USER_PFP_DIMENSIONS: Image.Dimensions = {
  width: 128,
  height: 128,
};

const userBucket = s3.from("users");

export namespace UserImage {
  export async function validatePfp(pfp: Buffer) {
    return Image.validate(pfp, USER_PFP_DIMENSIONS);
  }

  export async function uploadPfp(inputBuffer: Buffer) {
    const pfpBuffer = await Image.toWebp(inputBuffer, USER_PFP_DIMENSIONS);
    if (pfpBuffer instanceof Error) {
      console.error("Failed to convert user pfp!", pfpBuffer);
      return pfpBuffer;
    }

    const pfpPath = `pfp-${randomBase64(9)}-${Date.now()}.webp`;
    const { error: pfpUploadErr } = await userBucket.upload(
      pfpPath,
      pfpBuffer,
      {
        contentType: "image/webp",
      },
    );

    if (pfpUploadErr) {
      console.error("Failed to upload user pfp!", pfpUploadErr);
      return pfpUploadErr;
    }

    return userBucket.getPublicUrl(pfpPath).data.publicUrl;
  }

  export async function remove(urls: string[]) {
    const paths: string[] = [];

    for (const url of urls) {
      paths.push(url.substring(url.lastIndexOf("/") + 1));
    }

    return userBucket.remove(paths);
  }
}
