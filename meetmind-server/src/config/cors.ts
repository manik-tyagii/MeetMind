import { env } from "./env.js";

const allowedOrigins = [
  env.CLIENT_URL,
  "https://meet-mind-three.vercel.app",
  "https://meet-mind-tan-theta.vercel.app",
  "https://meetainotes.netlify.app",
  "http://localhost:5173",
];

const isHostedFrontend = (requestOrigin: string): boolean => {
  try {
    const { protocol, hostname } = new URL(requestOrigin);
    return (
      protocol === "https:" &&
      (hostname.endsWith(".vercel.app") || hostname.endsWith(".netlify.app"))
    );
  } catch {
    return false;
  }
};

export const corsOrigin = (
  requestOrigin: string | undefined,
  callback: (error: Error | null, origin?: boolean | string) => void,
) => {
  if (
    !requestOrigin ||
    allowedOrigins.includes(requestOrigin) ||
    isHostedFrontend(requestOrigin)
  ) {
    callback(null, requestOrigin ?? true);
    return;
  }

  callback(new Error(`CORS origin is not allowed: ${requestOrigin}`));
};
