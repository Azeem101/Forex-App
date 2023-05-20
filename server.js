import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/conn.js";
import userRoutes from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
import expertRoutes from './routes/expertRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import path from 'path';
//configure env
dotenv.config();

//databse config
// connectDB();
connectDB()
//rest object
const app = express();

//middelwares
app.use(cookieParser())
app.use(cors());
// app.use(cors());
app.use(express.json());
const __filename = path.resolve(import.meta.url.slice(7));
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "./client/build")))
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})
//routes
app.use('/api/v1/auth', userRoutes)
app.use('/expert', expertRoutes)

app.use('/admin', adminRoutes)

//rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Fx Signals app</h1>");
});

//PORT
const PORT = process.env.PORT || 8000;

//run listen
app.listen(PORT, () => {
    console.log(
        `Server Running on port ${PORT}`
    );
});