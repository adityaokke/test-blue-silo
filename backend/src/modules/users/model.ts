import bcrypt from "bcrypt";
import { Model, Schema, model } from "mongoose";
import { IUser, IUserMethods } from "./type";

// Combine document interface + methods
type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Hash password before save ────────────────────────────────────────────────

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ─── Instance method: compare password ───────────────────────────────────────

UserSchema.methods.comparePassword = async function (
  plainText: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, this.password);
};

// ─── Strip password from any JSON output ─────────────────────────────────────

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.password = "<hidden>";
    return ret;
  },
});

export const User = model<IUser, UserModel>("User", UserSchema);
