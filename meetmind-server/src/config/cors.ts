import { env } from "./env.js";

const allowedOrigins = new Set([
  env.CLIENT_URL,
  "https://meet-mind-three.vercel.app",
  "https://meet-mind-tan-theta.vercel.app",
  "https://meetainotes.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
]);

const isLocalhostFrontend = (requestOrigin: string): boolean => {
  try {
    const { protocol, hostname, port } = new URL(requestOrigin);
    const validLocalHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    const validPorts = new Set(["5173", "3000", "4173", "4174", "5000"]);

    return (
      (protocol === "http:" || protocol === "https:") &&
      validLocalHosts.has(hostname) &&
      (!port || validPorts.has(port))
    );
  } catch {
    return false;
  }
};

const isHostedFrontend = (requestOrigin: string): boolean => {
  try {
    const { protocol, hostname } = new URL(requestOrigin);
    return (
      protocol === "https:" && /(^|\.)((vercel|netlify)\.app)$/.test(hostname)
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
    allowedOrigins.has(requestOrigin) ||
    isLocalhostFrontend(requestOrigin) ||
    isHostedFrontend(requestOrigin)
  ) {
    callback(null, requestOrigin ?? true);
    return;
  }

  callback(new Error(`CORS origin is not allowed: ${requestOrigin}`));
};
