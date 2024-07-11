import express from 'express'
import mongoose, { mongo } from 'mongoose'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import cors from 'cors'
import listingRoute from './routes/listing.route.js'
dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(response=>console.log('Connected to DB!'))
    .catch(err=>console.log('Connection Failed'))
const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(express.json());
app.use(cookieparser());
app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/userListing",listingRoute);

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