import express from 'express'
import mongoose, { mongo } from 'mongoose'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
dotenv.config();

const route = express.Router();


mongoose.connect(process.env.MONGO)
    .then(response=>console.log('Connected to DB!'))
    .catch(err=>console.log('Connection Failed'))
const app = express()
app.use(express.json());
app.use(cookieparser());
app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);

//middle ware for error handling
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        message,
        statusCode,
        success:false
    })
})
app.listen(3000,()=>{
    console.log(`Server running on http://localhost:3000`)
})