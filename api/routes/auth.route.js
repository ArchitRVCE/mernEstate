import express from 'express'
import {signUp,signIn} from '../controllers/auth.controller.js'

const route = express.Router()

route.post("/signup",signUp);
route.post("/signin",signIn);
export default route

