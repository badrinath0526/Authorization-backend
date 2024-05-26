import path from "path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes.js"

import connectMongo from "./db/connection.js"

const PORT=process.env.PORT || 3025
const app=express()

const __dirname=path.resolve()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    connectMongo();
    console.log(`Server running on PORT ${PORT}` )
})