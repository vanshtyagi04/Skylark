import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyJWT = asyncHandler(async (req,res,next) => {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        if(!token) {
            return res.status(401).json({error: "Unauthorized request"});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password")
        if(!user){
            return res.status(401).json({error: "Invalid Access Token"});
        }
        req.user = user;
        next()
})

export default verifyJWT;