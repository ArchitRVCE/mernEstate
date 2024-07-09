import express from 'express'
import {userUpdate,userDelete} from '../controllers/user.controller.js'
import {verifyUsers} from '../utils/verifyUsers.js';

const route = express.Router();

route.post("/update/:id",verifyUsers,userUpdate);
route.delete("/delete/:id",verifyUsers,userDelete);
export default route