import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { env } from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;

const cookieBaseOptions = (req?: Request) => {
  const forwardedProto = req?.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto;
  const isHttpsRequest =
    !!req &&
    (req.secure ||
      req.protocol === "https" ||
      protocol === "https" ||
      protocol?.split(",")[0]?.trim() === "https");

  const isProduction = env.NODE_ENV === "production" || isHttpsRequest;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax" | "strict",
    path: "/",
  };
};

export const generateTokens = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id, role }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  req?: Request,
) => {
  const base = cookieBaseOptions(req);

  res.cookie("accessToken", accessToken, {
    ...base,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...base,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookies = (res: Response, req?: Request) => {
  const base = cookieBaseOptions(req);
  res.clearCookie("accessToken", base);
  res.clearCookie("refreshToken", base);
};
