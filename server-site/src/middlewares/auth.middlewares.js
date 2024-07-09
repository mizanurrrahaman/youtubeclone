import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError"


export const auth = async(req, res, next) => {
    try{

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if(!token) {
            return res.json(new ApiError(401, "unauthorized access"))
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKIN_SECRECT)
    
        if(! decodedToken) {
            return res.json(new ApiError(401, "unauthorized access"))
        }
        console.log("d", decodedToken);
        const user = await UserActivation.findById(decodedToken._id)
        req.user =  user
        next()
    } catch ( error) {
        return res.json(new ApiError(401, error.message))
    }

}