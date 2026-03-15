import { Request, Response } from "express";
import * as userService from "./service";

export const getUsers = async (req: Request, res: Response) => {
  const { level } = req.query;
  if (!level || typeof level !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Level query parameter is required and must be a string" });
  }
  const users = await userService.getUsersByLevel(level as string);
  res.json({ success: true, data: users });
};
