import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyJWT = async (req,res,next) => {
        try{
            const token = req.cookies?.jwt 
            if(!token) {
                return res.status(401).json({error: "Unauthorized request"});
            }
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decodedToken?.userId).select("-password")
            if(!user){
                return res.status(401).json({error: "Invalid Access Token"});
            }
            req.user = user;
            next()
        } catch(err){
            res.status(500).json({message: err.message});
            console.log("Error in auth middleware");
        }
}

export default verifyJWT;