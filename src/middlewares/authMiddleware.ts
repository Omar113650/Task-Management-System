import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface JwtPayload {
  id: string;
  email: string;
  role: "Admin" | "Member"; // متوافق مع الـ User model
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token missing after Bearer" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user?.role === "Admin") { // كانت isAdmin - غلط
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  });
};

export const verifyUserOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user?.role === "Admin" || req.user?.id === req.params.id) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Not allowed." });
    }
  });
};