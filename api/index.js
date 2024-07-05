import express from 'express'
import mongoose, { mongo } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

mongoose.connect(process.env.MONGO)
.then(response=>console.log('Connected to DB!'))
.catch(err=>console.log('Connection Failed'))
const app = express()

app.get('/',(req,res)=>{
    res.send('Hello API')
})
app.listen(3000,()=>{
    console.log(`Server running on http://localhost:3000`)
})