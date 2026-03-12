import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

interface Env {
  NODE_ENV: string;
  PORT: number;
  WEB_URL: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const schema = Joi.object<Env>({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  WEB_URL: Joi.string().uri().required(),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default("24h"),
}).unknown(true);

export const appEnv: Env = {
  NODE_ENV: process.env.NODE_ENV || "",
  PORT: Number(process.env.PORT),
  WEB_URL: process.env.WEB_URL || "",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
};
const { error } = schema.validate(appEnv);

if (error) {
  throw new Error(`Invalid environment variables:\n${error.message}`);
}
