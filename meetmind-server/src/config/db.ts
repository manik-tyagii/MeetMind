import mongoose from "mongoose";
import dns from "dns";

// Fallback to public DNS to resolve SRV record resolution issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);


export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI!;
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
