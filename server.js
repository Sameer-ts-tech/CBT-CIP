import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import ConnectDB from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import {v2 as cloudinary} from "cloudinary";
import path from "path";

dotenv.config();
ConnectDB();

let __dirname = path.resolve();

const app = express();
app.use(cors({
    origin : "*"
}))

const PORT = process.env.PORT || 8080;


//  middlewares
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

// setting up cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})


//  routes middleware
app.use("/api/users" , userRoutes);

app.use("/api/posts" , postRoutes);


app.use(express.static(path.join(__dirname , "thread-client" , "dist")));
app.get("*", function(_, res) {
    res.sendFile(path.join(__dirname, "thread-client", "dist", "index.html"));
  });
  


app.listen(PORT , ()=>{
    console.log("server online");
})