if (typeof window !== "undefined") {
  throw new Error("Server only module imported on client");
}
