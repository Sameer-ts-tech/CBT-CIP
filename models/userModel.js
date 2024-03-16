import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {type : String , required : true},
    username : {type : String , required : true , unique : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true},
    profilePic : {type : String , default : ""},
    followers : {type : [String] , default : []},
    following : {type : [String] , default : []},
    bio : {type : String , default : "" },
    role : {type : String , default : "normal"},

} , {timestamps : true});

const User = mongoose.model("user" , userSchema);

export default User;

