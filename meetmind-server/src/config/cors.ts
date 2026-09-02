import { env } from "./env.js";

const allowedOrigins = [
  env.CLIENT_URL,
  "https://meet-mind-three.vercel.app",
  "http://localhost:5173",
];

export const corsOrigin = (
  requestOrigin: string | undefined,
  callback: (error: Error | null, origin?: boolean | string) => void,
) => {
  if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
    callback(null, requestOrigin ?? true);
    return;
  }

  callback(new Error(`CORS origin is not allowed: ${requestOrigin}`));
};
