import mongoose from "mongoose";

const ConnectDB = async()=>{
   try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
   }catch(error){
    console.log("error in db " , error);
   }
}

export default ConnectDB; 