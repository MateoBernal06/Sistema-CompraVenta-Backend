import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI_ATLAS);

        console.log("Database connected successfully!!");
        console.log(`Database: ${conn.connection.name}`);
        console.log(`Host: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:");
        console.error(error.message);
    }
};

export default connection;

