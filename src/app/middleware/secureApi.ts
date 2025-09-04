import { NextFunction, Request, Response } from "express";

export const secureApi = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // Prevent MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Referrer Policy
    res.setHeader("Referrer-Policy", "no-referrer");

    // Permissions Policy (formerly Feature Policy)
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    // Content Security Policy (CSP)
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
    );

    next();
}