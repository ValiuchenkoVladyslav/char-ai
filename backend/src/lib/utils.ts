export function logErrWithFallback<FB>(errPrefix: string, fallback: FB) {
  return (err: unknown) => {
    console.error(errPrefix, err);

    return fallback;
  };
}
