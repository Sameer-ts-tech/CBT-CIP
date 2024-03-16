import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async(req,res,next)=>{

    try{
        const token = req.cookies.jwt;
        if(!token) return res.json({error : "unauthorize"});
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY);
        const id = decodedToken._id;
        const user = await User.findById(id);
        req.user = user;
        next();
    }catch(error){
        console.log(error);
        res.json({error : "error in protectRoute " , error})
    }

}
export default protectRoute;