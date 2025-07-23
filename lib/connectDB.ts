import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ✅ load .env.local manually


import mongoose, { Connection } from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;
console.log("Loaded MONGODB_URI:", MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in .env file");
}

const globalCache = global.mongoose || {
  conn: null as Connection | null,
  promise: null as Promise<Connection> | null,
};

global.mongoose = globalCache;

export async function connectDB(): Promise<Connection> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    globalCache.promise = mongoose.connect(MONGODB_URI!, options).then((mongooseInstance) => mongooseInstance.connection);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    globalCache.promise = null;
    process.exit(1);
  }

  return globalCache.conn;
}
