import { Image } from "~/lib/image";
import { s3 } from "~/lib/storage";

const CHARACTER_PFP_DIMENSIONS: Image.Dimensions = {
  width: 128,
  height: 128,
};

const CHARACTER_COVER_IMG_DIMENSIONS: Image.Dimensions = {
  width: 512,
  height: 512,
};

const characterBucket = s3.from("characters");

export namespace CharacterImage {
  export async function validatePfp(pfp: Buffer) {
    return Image.validate(pfp, CHARACTER_PFP_DIMENSIONS);
  }

  export async function uploadPfp(inputBuffer: Buffer, creatorId: number) {
    const pfpBuffer = await Image.toWebp(inputBuffer, CHARACTER_PFP_DIMENSIONS);
    if (pfpBuffer instanceof Error) {
      console.error("Failed to convert character pfp!", pfpBuffer);
      return pfpBuffer;
    }

    const pfpPath = `pfp-${creatorId}-${Date.now()}.webp`;
    const { error: pfpUploadErr } = await characterBucket.upload(
      pfpPath,
      pfpBuffer,
      {
        contentType: "image/webp",
      },
    );

    if (pfpUploadErr) {
      console.error("Failed to upload character pfp!", pfpUploadErr);
      return pfpUploadErr;
    }

    return characterBucket.getPublicUrl(pfpPath).data.publicUrl;
  }

  export async function validateCover(cover: Buffer) {
    return Image.validate(cover, CHARACTER_COVER_IMG_DIMENSIONS);
  }

  export async function uploadCoverImage(
    inputBuffer: Buffer,
    creatorId: number,
  ) {
    const coverBuffer = await Image.toWebp(
      inputBuffer,
      CHARACTER_COVER_IMG_DIMENSIONS,
    );
    if (coverBuffer instanceof Error) {
      console.error("Failed to process character cover image!", coverBuffer);
      return coverBuffer;
    }

    const coverPath = `img-${creatorId}-${Date.now()}.webp`;
    const { error: coverUploadErr } = await characterBucket.upload(
      coverPath,
      coverBuffer,
      {
        contentType: "image/webp",
      },
    );

    if (coverUploadErr) {
      console.error("Failed to upload cover image!", coverUploadErr);
      return coverUploadErr;
    }

    return characterBucket.getPublicUrl(coverPath).data.publicUrl;
  }

  export async function remove(urls: string[]) {
    const paths: string[] = [];

    for (const url of urls) {
      paths.push(url.substring(url.lastIndexOf("/") + 1));
    }

    return characterBucket.remove(paths);
  }
}
