export function logErrWithFallback<FB>(errPrefix: string, fallback: FB) {
  return (err: unknown) => {
    console.error(errPrefix, err);

    return fallback;
  };
}

export function isId(num: number) {
  return Number.isInteger(num) && num > 0;
}

export async function fileToBuffer(file: File) {
  return file
    .arrayBuffer()
    .then(Buffer.from)
    .catch(() => new Error("Invalid file!"));
}
