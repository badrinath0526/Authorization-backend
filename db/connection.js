import mongoose from "mongoose";

const connectMongo=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDb")
    } catch (error) {
        console.log("Error connecting to MongoDb",error.message);
    }
}
export default connectMongo