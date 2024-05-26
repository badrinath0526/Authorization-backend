import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import generateToken from "../generateToken.js"

export const signup=async(req,res)=>{
    try {
        const{fullName,username,password,confirmPassword,gender}=req.body
        if(password!==confirmPassword){
            return res.status(400).json({error:"Passwords don't match"})
        }

        const user=await User.findOne({username})
        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=await new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            username:newUser.username,
            gender:newUser.gender,
        })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup controller",error.message)
        console.log(req.body)
        res.status(500).json({error:"Internal server error"})
    }
}

export const login=async(req,res)=>{
    try {
        const{username,password}=req.body
        const user=await User.findOne({username})
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");
        if(!user||isPasswordCorrect){
            return res.status(400).json({error:"Passwords don't match"})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
        })
    } catch (error) {
        console.log("Error in login controller",error.message);
        return res.status(500).json({error:"Internal Server Error"})
    }
}

export const logout =async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
        return res.status(500).json({error:"Internal Server Error"})
    }
}

export const user=async(req,res)=>{
    try {
        const userId=req.user._id
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            gender:user.gender,
        })
    } catch (error) {
        console.log("Error in user controller",error.message);
        res.status(500).json({error:"Internal Server error"})
    }
}