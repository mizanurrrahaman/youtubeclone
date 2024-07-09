import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { Apirespose } from "../utils/Apirespons.js";



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



const generateAccessAndRefreshToken = async()=> {
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
  const { username, fullName, email, password } = req.body;

  if ([username, fullName, email, password].some(field => !field?.trim())) {
    return res.status(400).json(new ApiError(400, 'All fields are required'));
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json(new ApiError(400, 'Username or email already taken'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    res.status(201).json(new Apirespose(201, "User registered successfully", createdUser));
  } catch (err) {
    console.error('Registration error', err);
    res.status(500).json(new ApiError(500, 'Internal server error'));
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
     console.log("a", userFound);
    const isPassword = await userFound.isPasswordCorrent(password)
     console.log("b", isPassword)
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
     await User.findByIdAndUpdate(req.user?._id, {
        $set: {refreshToken: null}
     }, {
        $new : true
     })
     let options = {
       secure: true,
       httpOnly: true
     }
     res.clearCookie("accessToken".options).clearCookie("refreshToken", options).json(new Apirespose(200, "ok"))
  }

export { register, login, logout }


{/*

  mongoose.connect('mongodb://localhost:27017/yourdatabase', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverSelectionTimeoutMS: 30000,  // Increase the timeout to 30 seconds
   socketTimeoutMS: 45000  // Increase the socket timeout to 45 seconds
 }).then(() => {
   console.log('MongoDB connected');
 }).catch(err => {
   console.error('Connection error', err);
 });
 

const register = async (req, res)=> {
   const { username, fullName, email, password } = req.body;

  if ([username, fullName, email, password].some(field => !field?.trim())) {
    return res.status(400).json(new ApiError(400, 'All fields are required'));
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json(new ApiError(400, 'Username or email already taken'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      statusCode: 201,
      message: 'User registered successfully',
    });
  } catch (err) {
    console.error('Registration error', err);
    res.status(500).json(new ApiError(500, 'Internal server error'));
  }
   
    const user = await User.create({ username, fullName, email, password})
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser) {

    }
    res.json(new Apirespose(201, "user created", createdUser))

   
};


const register = async (req, res)=> {
   const {username, fullName, email, password} = req.body

     if([username, fullName, email, password].some((field) => field?.trim() === " ")) {
        res.json( new  ApiError(400, "all fields are required"))
     } 
     const existingUser = await User.findOne({
        $or: [{username}, {email}]
     })
     if(!existingUser){
        res.json({
            statusCode:400,
            message: "username ache",
        })
     }
    //console.log(existingUser)
}
*/}