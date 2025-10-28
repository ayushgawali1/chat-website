import mongoose from "mongoose";

const ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error in DB connection",error.message);
    }
}

export default ConnectDB;