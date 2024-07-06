import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},{timeStamps:true});

const User = mongoose.model('user',userSchema);
export default User;

