import type { RequestHandler } from "express";

export const secureApi: RequestHandler = (req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://sawdia-electrics-and-hardare-fronte.vercel.app https://sawdia-electrics-and-hardare-fronte.vercel.app ws: wss:",
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);

  next();
};
