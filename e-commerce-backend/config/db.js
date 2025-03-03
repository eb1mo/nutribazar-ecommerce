import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () =>
{
    try
    {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected");

    } catch (e)
    {
        console.log(e.message);
        process.exit(1);
    }
}

export default connectDB;