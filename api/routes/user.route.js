import express from 'express'
import {userUpdate,userDelete,getUser} from '../controllers/user.controller.js'
import {verifyUsers} from '../utils/verifyUsers.js';

const route = express.Router();

route.post("/update/:id",verifyUsers,userUpdate);
route.delete("/delete/:id",verifyUsers,userDelete);
//to get user for contact component
route.get("/:id",verifyUsers,getUser);
export default route