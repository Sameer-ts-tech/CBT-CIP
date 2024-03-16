import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import {v2 as cloudinary} from "cloudinary";

const postController = ()=>{

    return{
        createPost : async(req,res)=>{
            try{
                const{postedBy , text} = req.body;
                let {img} = req.body;
                console.log(postedBy);

                if(!postedBy || !text) return res.json({error : "postedBy and text is required"});

                const user = await User.findById(postedBy);

                if(!user){
                    return res.json({error : "user not found"});
                }

                if(user._id != req.user._id.toString()) return res.json({error : "not authorize"});

                const maxLength = 500;

                if(text.length > maxLength){
                    return res.json({error : "text must be within 500 words"})
                }

                if(img){
                    // checking if user have already a profile pic present then first we are going to destroy it
                    const uploadedResponse = await cloudinary.uploader.upload(img);
                    img = uploadedResponse.secure_url;
                   }
                   

                const newPost = new Post({
                    postedBy,
                    text,
                    img,
                })

                await newPost.save();

                return res.json({success : "new post created" , post : newPost});


            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },

        getPost : async(req,res)=>{
            try{
                const {id} = req.params;
                const postId = id;
                const post = await Post.findById(postId);
                if(!post) return res.json({error : "post not found"});

                return res.json({success :"post found" , post});

            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },
        
        deletePost : async(req,res)=>{
            try{
                const postId = req.params.id;
                const post = await Post.findById(postId);
                if(!post) return res.json({error : "post not found"});

                if(post.postedBy.toString() !== req.user._id.toString()) return res.json({error : "not authorize"});

                if(post.img){
                    const imageId = post.img.split("/").pop().split(".")[0]
                    await cloudinary.uploader.destroy(imageId);
                }

                await Post.findByIdAndDelete(postId);
                return res.json({success : "post deleted"});

            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },

        likeAndUnlikePost : async(req,res)=>{
            try{
                const postId = req.params.id;
                let post = await Post.findById(postId);
                
                if(!post) return res.json({error : "post not found"});

                if(post.likes.includes(req.user._id.toString())){
                    //  to unlike the post
                    post = await Post.findByIdAndUpdate(postId , {$pull : {likes : req.user._id}});
                    return res.json({success : "unliked the post" , post});
                }else{
                    // to like the post
                post = await Post.findByIdAndUpdate(postId , {$push : {likes : req.user._id}});
                return res.json({success : "liked the post" , post});
                }
            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },

        replyToPost : async(req,res)=>{
            try{
                const {text} = req.body;
                const {id : postId} = req.params;
                const userId = req.user._id;
                const userProfilePic = req.user.profilePic;
                const username = req.user.username;

                if(!text){
                    return res.json({error : "text is required to reply"});
                }

                const post = await Post.findById(postId);
                if(!post) return res.json({error : "post is not found"});

                const reply = {userId , text , userProfilePic , username};

                post.replies.push(reply);
                await post.save();
                
                return res.json({success : "reply successfully" , post});

            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },

        deleteReply : async(req,res)=>{
            try{
                const {replyId} = req.body;
                const {id : postId} = req.params;
                const post = await Post.findById(postId);
                if(!post) return res.json({error : "post not found"});

                const userId = req.user._id;

                const newPost = await Post.findByIdAndUpdate(postId , {$pull : {replies : {_id : replyId}}});

                return res.json({success : 'success' , post : newPost});

            }catch(error){
                console.log(error);
                return res.json({error});
            }
        },
        
        getFeed : async(req,res)=>{
            const userId = req.user._id;
            const user = await User.findById(userId);
            if(!user) return res.json({error : "user not found"});

            const following = user.following;

            const feedPosts = await Post.find({postedBy : {$in : following}  }).sort({createdAt : -1});

            return res.json({success : "feed post fetched" , feedPosts});

        },

        getUserAllPost : async(req,res)=>{
            try{
                const {username} = req.params;
                const user = await User.findOne({username});
                if(!user) return res.json({error : "no user exsists with that username"});

                const userId = user._id;

                const posts = await Post.find({postedBy : userId}).sort({createdAt : -1});
                return res.json({success : "all user posts fetched successfully" , posts});
            }catch(error){
                return res.json({error});
            }
        },

    }

}

export default postController