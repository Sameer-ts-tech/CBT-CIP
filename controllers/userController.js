import User from "../models/userModel.js";
import Post from "../models/postModel.js";
// import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";

const userController = ()=>{
    
    return{

        signupUser : async(req,res)=>{
            try{
                console.log(req.body);
                const {name , email , username , password} = req.body;
                const user = await User.findOne({$or : [{email}, {username}]});

                if(user){
                    console.log(user);
                    return res.json({error : "user already exsist"});
                }

                // const salt = await bcrypt.genSalt(10);
                // const hashedPassword = await bcrypt.hash(password , salt);

                const newUser = new User({
                    name , email , username , password
                })

                await newUser.save();
                
                if(newUser){
                    await generateTokenAndSetCookie(res , newUser);
                    return res.json({success : "user stored in DB" , user : newUser});
                }
                else return res.json({error : "something went wrong"})

            }catch(error){
                console.log(error);
                return res.json({error : error});
            }

        },

        loginUser : async(req,res)=>{
            try{
                const{username , password} = req.body;

                const user = await User.findOne({username});
                if(!user) return res.json({error : "user not exsist"});

                // const isPasswordMatch = await bcrypt.compare(password , user.password);
                const isPasswordMatch = password === user.password;
                
                if(!isPasswordMatch) return res.json({error : "password is wrong"});

                await generateTokenAndSetCookie(res , user);
                return res.json({success : "logged in successfully" , user });

            }catch(error){
                console.log(error);
                return res.json({error});
            }

        },

        logoutUser : async(req,res)=>{
            try{
                res.cookie("jwt" , "", {maxAge : 1});
                return res.json({success : "user logged out successfully"});
            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },

        followUnfollowUser : async(req,res)=>{
            try{
                console.log("inside the follow function");
                const{id} = req.params;
                const userToModify = await User.findById(id);
                const currentuser = await User.findById(req.user._id);

                if(id === currentuser._id) return res.json({error : "you cannot follow yourself"});

                const isFollowing = userToModify.followers.includes(req.user._id);
                console.log(isFollowing);
                if(isFollowing){
                    //  to unfollow the user
                    await User.findByIdAndUpdate(id , {$pull : {followers : req.user._id}});
                    await User.findByIdAndUpdate(req.user._id , {$pull : {following : id}});
                    return res.json({success : "unfollowed"})
                }else{
                    // to follow the user
                    await User.findByIdAndUpdate(id , {$push : {followers : req.user._id}});
                    await User.findByIdAndUpdate(req.user._id , {$push : {following : id}});
                    return res.json({success : "followed"});
                }

                console.log(req.user);
                return res.json({working : "working"});
            }catch(error){
                return res.json({error :error});
            }
        },

        updateUserProfile : async(req,res)=>{

            const {name , email , username , password  , bio} = req.body;
            let {profilePic}  = req.body;
            const uesrId = req.user._id;
            const{id} = req.params;

            try{

                if(id != uesrId.toString()) return res.json({error : "you can't update the profile of other users"});

            let user = await User.findById(uesrId);
            if(!user) return res.json({error : "user not found"});



        //    if(username || email){
        //     const otherUser = await User.findOne({$or : [{email} , {username}]})
        //     if(otherUser) return res.json({error : "username or email not available"});
        //    }



           if(profilePic){
            // checking if user have already a profile pic present then first we are going to destroy it
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
           }
           
            user.name = name || user.name;
            user.username = username || user.username;
            user.profilePic = profilePic || user.profilePic;
            user.bio = bio || user.bio;
            user.email = email || user.email;

            if(password){
                // const salt = await bcrypt.genSalt(10);
                // const hashedPassword = await bcrypt.hash(password , salt);
                user.password = password;
            }

            await user.save();
            
            await Post.updateMany({"replies.userId" : uesrId},{
                $set : {
                    "replies.$[reply].username" : user.username,
                    "replies.$[reply].userProfilePic" : user.profilePic
                }
            },
            {arrayFilters : [{"reply.userId" : uesrId}]}
            )

           user.password = null;
            return res.json({success : "profile updated" , user});

            }catch(error){
                console.log(error);
            }
        },

        getUserProfile : async(req,res)=>{
            const {query} = req.params;

            // we will either fetch with username or with id
            try{

                let user;

                if(mongoose.Types.ObjectId.isValid(query)){
                    user = await User.findOne({_id : query}).select("-password").select("-updatedAt");
                }else{
                    user = await User.findOne({username : query}).select("-password").select("-updatedAt");
                }

                if(!user) return res.json({error : "user not found"})

                return res.json({success : "user found" , user});
                
            }catch(error){
                console.log(error);
            }

        },

        getFollowersList : async(req,res)=>{
            try{
                const {username} = req.params;
                const user = await User.findOne({username});
                if(!user) return res.json({error : "user not found"});

                const followersIds = user.followers;
                console.log(followersIds);

                const followersUsers = await User.find({_id : {$in : followersIds }});
                return res.json(followersUsers);
            }catch(error){
                return res.json({error});
            }
        },

        getAllUsers : async(req,res)=>{
            try{
                const users = await User.find({});
                return res.json(users);
            }catch(error){
                return res.json({error});
            }
        },

    }
}

export default userController;
