import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/errorHandler.js";

export const signUp = async (req,res,next) => {
    const {username,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    User.create({
        username,
        email,
        password: hashedPassword
    }).then(response=>{
        res.status(201).json({message:"User added succes"})
    }).catch(error=>{
        next(error);
        //next(errorHandler(420,"Testing errorhandler"))
    })

}