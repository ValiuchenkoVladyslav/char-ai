import sharp from "sharp";

export async function isImage(buffer: Buffer) {
  try {
    await sharp(buffer).metadata();
    return true;
  } catch {
    return false;
  }
}
