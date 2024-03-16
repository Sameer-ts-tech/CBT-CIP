import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async(res , newUser)=>{

    const user = {
        _id : newUser._id,
        name : newUser.name,
        username : newUser.username,
        email : newUser.email,
    }

    const token = jwt.sign(user , process.env.JWT_SECRET_KEY , {expiresIn : "1D"});
    res.cookie("jwt" , token , {
        // httpOnly : true,
        maxAge : 15*24*60*60*100,
        // sameSite : "strict",
    });
    return token;
}

export default generateTokenAndSetCookie;