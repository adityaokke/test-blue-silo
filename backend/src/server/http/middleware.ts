import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { appEnv } from "../../config/env";
import { IAuthUser } from "../../modules/users/type";
import { AuthRequest } from "../shared/types/authRequest";
import { TicketLevel } from "../../modules/tickets/type";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const authHeaderParts = authHeader.split(" ");
  if (!authHeaderParts[1]) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeaderParts[1];

  try {
    const decoded = jwt.verify(
      token,
      appEnv.JWT_SECRET,
    ) as unknown as IAuthUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireLevel = (...levels: TicketLevel[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!levels.includes(req.user.role.level)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
};