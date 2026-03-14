import { User } from "./model";
import * as userRepository from "../userRoles/repository";

export const getUsersByLevel = async (level: string) => {
  const role = userRepository.findByLevel(level);
  if (!role) {
    throw new Error(`Role with level ${level} not found`);
  }
  const users = await User.find({ roleId: role.id, isActive: true }, "name email level");
  return users;
};
