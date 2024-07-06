import express from 'express'
import mongoose, { mongo } from 'mongoose'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
dotenv.config();

const route = express.Router();


mongoose.connect(process.env.MONGO)
    .then(response=>console.log('Connected to DB!'))
    .catch(err=>console.log('Connection Failed'))
const app = express()

app.use("/api/user",userRoute);

app.listen(3000,()=>{
    console.log(`Server running on http://localhost:3000`)
})