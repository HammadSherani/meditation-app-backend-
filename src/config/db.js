import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
  try {
    // const connection = await mongoose.connect(config.database.url, config.database.options);
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    console.log("connected");
    
} catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message || err);
    process.exit(1); 
  }
};

export default connectDb;
