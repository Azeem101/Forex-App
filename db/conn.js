import mongoose from 'mongoose';

import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE)
        console.log(
            `Conneted To Mongodb Databse ${conn.connection.host}`
        );
    } catch (error) {
        console.log(`Errro in Mongodb ${error}`);
    }
}

export default connectDB;