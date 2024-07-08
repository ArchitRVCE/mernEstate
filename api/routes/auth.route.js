import express from 'express'
import {signUp,signIn,googleSignIn} from '../controllers/auth.controller.js'

const route = express.Router()

route.post("/signup",signUp);
route.post("/signin",signIn);
route.post("/google",googleSignIn);
export default route

