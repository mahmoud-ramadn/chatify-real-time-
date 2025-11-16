import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is missing");
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
