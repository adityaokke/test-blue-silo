import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

interface Env {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
}

const schema = Joi.object<Env>({
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default("24h"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
}).unknown(true);

export const appEnv: Env = {
  PORT: Number(process.env.PORT),
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",
  NODE_ENV: process.env.NODE_ENV || "",
};
const { error } = schema.validate(appEnv);

if (error) {
  throw new Error(`Invalid environment variables:\n${error.message}`);
}
