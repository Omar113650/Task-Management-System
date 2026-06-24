import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/User";

interface TokenPayload {
  id: string;
  email: string;
  role: "Admin" | "Member";
}

export const generateTokens = (user: IUser) => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const setRefreshCookie = (
  res: Response,
  refreshToken: string
) => {
  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie("RefreshToken");
};