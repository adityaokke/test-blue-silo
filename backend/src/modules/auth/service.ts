import jwt from "jsonwebtoken";
import { appEnv } from "../../config/env";
import { ApiError } from "../../shared/utils/error";
import { User } from "../users/model";
import { IUserPayload } from "../users/type";
import { USER_ROLES } from "../userRoles/model";

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  // Get role details from static list
  const role = USER_ROLES.find((r) => r.id === user.roleId);
  if (!role) throw new ApiError(400, "Invalid role assigned to user");

  const payload: IUserPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: role,
  };

  const token = jwt.sign(payload, appEnv.JWT_SECRET, { expiresIn: "24h" });

  return { token, user: payload };
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const userRole = await USER_ROLES.find((r) => r.code === role);
  if (!userRole) throw new ApiError(400, "Invalid role specified");

  // Create user — password hashing handled by Mongoose pre-save hook
  const user = await User.create({ name, email, password, roleId: userRole.id });

  const payload: IUserPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: userRole,
  };

  const token = jwt.sign(payload, appEnv.JWT_SECRET, { expiresIn: "24h" });

  return { token, user: payload };
};