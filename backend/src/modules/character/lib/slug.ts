import slugify from "slugify";

const slugifyOptions: Parameters<typeof slugify>[1] = {
  replacement: "-", // replace spaces with replacement character
  remove: undefined, // remove characters that match regex
  lower: true, // convert to lower case
  strict: true, // strip special characters except replacement
  locale: "vi", // language code of the locale to use
  trim: true, // trim leading and trailing replacement chars
};

export namespace Slug {
  export function encode(id: number, name: string) {
    return `${id}-${slugify(name, slugifyOptions)}`;
  }

  export function decode(slug: string) {
    const index = slug.indexOf("-");
    if (index === -1) return null;

    const id = Number(slug.substring(0, index));

    if (Number.isNaN(id)) return null;

    return {
      id,
      slugifiedName: slug.substring(index + 1),
    };
  }
}
