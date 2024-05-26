import express from "express"
import {signup,login,logout,user} from "../controllers/authcontrollers.js"
import protectRoute from "../middleware/protectRoute.js"
const router=express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.get("/user",protectRoute,user)

router.post("/logout",logout)

export default router