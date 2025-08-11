import sharp from "sharp";

const resizeOptions: sharp.ResizeOptions = {
  fit: "cover",
};

export namespace Image {
  export interface Dimensions {
    width: number;
    height: number;
  }

  export async function validate(
    buffer: Buffer,
    minDimensions?: Partial<Dimensions>,
  ) {
    const metadata = await sharp(buffer)
      .metadata()
      .catch(() => null);

    if (metadata === null) {
      return new Error("Invalid image!");
    }

    const format = metadata.format.toLowerCase();

    // it's impossible to calculate dimensions for an svg
    if (minDimensions !== undefined && format === "svg") {
      return new Error("Format not supported!");
    }

    // reject animated images
    if (format === "gif") {
      return new Error("Format not supported!");
    }

    if (
      (metadata.pages && metadata.pages > 1) ||
      (metadata.pageHeight && metadata.pageHeight > 0)
    ) {
      return new Error("Format not supported!");
    }

    // validate dimensions
    if (minDimensions?.width && metadata.width < minDimensions.width) {
      return new Error("Image too small!");
    }

    if (minDimensions?.height && metadata.height < minDimensions.height) {
      return new Error("Image too small!");
    }

    return true;
  }

  export async function toWebp(buffer: Buffer, dimensions: Dimensions) {
    return sharp(buffer)
      .resize(dimensions.width, dimensions.height, resizeOptions)
      .webp({ quality: 80 })
      .toBuffer()
      .catch((err) => {
        if (err instanceof Error) {
          return err;
        }

        return new Error("Unknown error");
      });
  }
}
