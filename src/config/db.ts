import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://testdb:testdb@cluster0.qqokkzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Mongodb connected")
    } catch (error: any) {
        console.log("connection error", error?.message);
    }
};

export default connectDatabase;