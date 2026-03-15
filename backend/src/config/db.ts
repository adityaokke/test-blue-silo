import mongoose from "mongoose";
import { appEnv } from "../config/env";

const connectDB = async (): Promise<void> => {
  // Enable query logging in development
  if (appEnv.NODE_ENV === "development") {
    mongoose.set("debug", true);
  }

  try {
    const conn = await mongoose.connect(appEnv.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
