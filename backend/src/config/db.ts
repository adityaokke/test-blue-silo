// src/config/db.ts
import mongoose from "mongoose";
import { appEnv } from "../config/env";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(appEnv.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;