import { response } from "express";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const signUp = async (req,res) => {
    const {username,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    User.create({
        username,
        email,
        password: hashedPassword
    }).then(response=>{

        console.log('User added succesfully');
        res.status(201).json({message:"User added succes"})
    }).catch(error=>{
        res.status(500).json({message:error.message})
    })

}