import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo connection successful`);
  } catch (error) {
    console.log("could not connect to database");
  }
};
