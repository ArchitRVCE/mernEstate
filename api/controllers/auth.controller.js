import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';

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

export const signIn = async (req,res,next) => {
    const {email,password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser)  return next(errorHandler(404,"User not found!"))
        const validPassword = bcrypt.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,"Incorrect Credentials"))
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:extractPass,...rest} = validUser._doc;
        res.cookie('access_token',token,{httpOnly:true, expiresIn: new Date(Date.now) + 24*60}).status(200).json(rest);
    } catch (error) {
        next(error);
    }

}