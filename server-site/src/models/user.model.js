import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema({
  username: {
    required: true,
    type: String,
    unique: true
  },
  fullName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    type: String,
  },
  coverPhoto: {
    type: String,
  },
  refreshToken: {
    type: String
  }

  },{
    timestamps: true
  })

  userSchema.pre("save", async function(next) {
     if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        next()
     } else {
      return next()
     }

  })


  userSchema.methods.isPasswordCorrent = async function(password) {
     return await bcrypt.compare(password, this.password);
  }

  userSchema.methods.generateAccessToken =  function(password) {
       const accessToken = jwt.sign({ _id: this._id, username: this.username, email: this.email}, 
      process.env.ACCESS_TOKIN_SECRECT, {
        expiresIn: process.env.ACCESS_TOKIN_EXPIRY
      });
       return accessToken
  }

  userSchema.methods.generateRefreshToken = function () {
      const refreshToken = jwt.sign({ _id: this._id, username: this.username, email: this.email}, 
        process.env.REFRESH_TOKIN_SECRECT, {
          expiresIn: process.env.REFRESH_TOKIN_EXPIRY
        });

        return refreshToken
  }

  export const User = mongoose.models.User ?? mongoose.model("User", userSchema)