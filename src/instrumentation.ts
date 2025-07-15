export function register() {
  // check envs
  for (const key of [
    "DB_URL",
    "REDIS_URL",
    "REDIS_TOKEN",
    "JWT_SECRET_ENCODE",
    "JWT_SECRET_DECODE",
  ]) {
    if (!process.env[key]) {
      throw new Error(`${key} environment variable not set!`);
    }
  }
}
