import express from 'express'
import {userUpdate} from '../controllers/user.controller.js'
import {verifyUsers} from '../utils/verifyUsers.js';

const route = express.Router();

route.post("/update/:id",verifyUsers,userUpdate);

export default route