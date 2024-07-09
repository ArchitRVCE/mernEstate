import express from 'express'
import {signUp,signIn,googleSignIn, signOut} from '../controllers/auth.controller.js'

const route = express.Router()

route.post("/signup",signUp);
route.post("/signin",signIn);
route.post("/google",googleSignIn);
route.get("/signout",signOut);
export default route

