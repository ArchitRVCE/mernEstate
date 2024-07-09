import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js"
import bcryptjs from 'bcryptjs'

export const userUpdate = async(req,res,next) =>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,"You can update only your account"));
    try {
        if(req.body.password && req.body.password!==''){
            req.boyd.password = bcryptjs.hashSync(req.body.password,10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar: req.body.avatar
            }
        },{new:true});
        const {password:extractPass,...rest} = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

export const userDelete = async(req,res,next) => {
    if(req.user.id!==req.params.id) return next(errorHandler(401,'You can delete only your account'))
    try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}
