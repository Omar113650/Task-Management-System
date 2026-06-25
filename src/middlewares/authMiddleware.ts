import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface JwtPayload {
  id: string;
  email: string;
  role: "Admin" | "Member";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Verify Access Token
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Access token is required",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

// Admin Only
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  verifyToken(req, res, () => {
    if (req.user?.role !== "Admin") {
      res.status(403).json({
        message: "Admins only",
      });
      return;
    }

    next();
  });
};

// Member Or Admin
export const verifyMember = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  verifyToken(req, res, () => {
    if (req.user?.role === "Member") {
      next();
      return;
    }

    res.status(403).json({
      message: "Access denied",
    });
  });
};
