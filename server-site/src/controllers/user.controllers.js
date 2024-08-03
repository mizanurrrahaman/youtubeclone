import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { Apirespose } from "../utils/Apirespons.js";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinary.js";
import { publicidx } from "../utils/publicdex.js";
import jwt from "jsonwebtoken";



// MongoDB Connection
//'mongodb://localhost:27017/yourDatabaseName'


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectDB();



const generateAccessAndRefreshToken = async(user)=> {
    try{
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken = refreshToken
       await user.save();
       return {accessToken, refreshToken} 

    } catch(error) {
      console.log("token generate error", error.message);
    }
}

 


const register = async (req, res)=> {

  try {
      const { username, fullName, email, password } = req.body;

     if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
      //return res.status(400).json(new ApiError(400, 'All fields are required'));
      return res.json(new ApiError())
      }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.json({statusCode: 400, message: "user ache", 
    

      })
    }
    const user = await User.create({username, fullName, email, password})
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
     if(!createdUser){
       return res.json(new ApiError(500))
     }
     res.json(new Apirespose(201, "user created", createdUser))

  } catch (error) {
   console.log(error.message);
   return res.json(new ApiError (500, error.message))
  }
};

const login  = async (req, res) => {
  try{
    const {email, password} = req.body
    if([email, password].some((field) => field?.trim() ===  " ")) {
       return res.json(new ApiError())
    }
    const userFound = await User.findOne({email})
    if(!userFound) {
     return res.json(new ApiError(402, "user fot found"))
    }
    const isPassword = await userFound.isPasswordCorrent(password)
     
     if(!isPassword) {
        return res.json(new ApiError(402, "authtication failed"))
     }
  
     const {accessToken, refreshToken} = await generateAccessAndRefreshToken(userFound)
     const loginUser = await User.findById(userFound._id).select("-password")
      let options = {
        secure : true,
        httpOnly: true
      }
       res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new Apirespose(200, "login successfully", {loginUser, accessToken}))
  } catch (error) {
     return res.json(new ApiError(400, error.message))
 }


   } 

  const logout = async (req, res )=> {
     const user =  await User.findByIdAndUpdate(req.user?._id, {
        $set: {refreshToken: null}
     }, {
        $new : true
     })
     let options = {
       secure: true,
       httpOnly: true
     }
     console.log(user)
     res.clearCookie("accessToken".options).clearCookie("refreshToken", options).json(new Apirespose(200, "ok"))
  }

  const  uploadAvatarAndCover = async ( err, req, res) => {
      try {
        if(req.files) {
           const {avatar, cover} = req.files
          
            if(avatar) {
              const {path} = avatar[0]
              const {secure_url} = await cloudinaryUpload(path, "user")
              if(req.user.avatar) {
                const publicId = publicidx(req.user.avatar)
                await cloudinaryDelete(publicId)
              }
              req.user.avatar = secure_url
              await req.user.save({ validateBeforeSave: false })
              const user = await User.findById(req.user._id).select("-password")
              console.log("u", user)
              res.json(new Apirespose(200 , "avatar uploded", user))
            }
            if(cover) {
              const {path} = cover[0]
              const {secure_url} = await cloudinaryUpload(path, "user")
              if(req.user.cover) {
                  const publicId = publicidx(req.user.cover)
                  await cloudinaryDelete(publicId)
              }

              req.user.cover = secure_url
              await req.user.save()
              const user = await User.findById(req.user._id).select("-password")
              res.json(new Apirespose(200, "cover uploded", user))
            } 
        } else{
           return res.json(new ApiError(402, "no file found"))
        }
      } catch( error) {
         console.log("eee", error.message)
      }
  }

  const generateAccessToken = async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken
    
    if(!token) {
        return res.json(new ApiError(401, "token is not here"))
    }
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKIN_SECRECT)
    if(!decodedToken) {
      return res.json(new ApiError(401, "unauthorized access"))
    }
    const user = await User.findById(decodedToken._id)

    if(!user) {
      return res.json(new ApiError(401, "token is not here"))
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user)

    let options = {
      secure: true,
      httpOnly: true
    }
    res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new Apirespose(200, "token generate successfully", {user, accessToken}))

  }


export { register, login, logout, uploadAvatarAndCover, generateAccessToken }


