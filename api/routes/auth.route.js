import express from 'express'
import {signUp} from '../controllers/auth.controller.js'

const route = express.Router()

route.post("/signup",signUp);

export default route

