import express from "express";
import postController from "../controllers/postController.js";
import protectRoute from "../middlewares/projectRoute.js";
import userController from "../controllers/userController.js";
const router = express.Router();


router.get("/feed/posts" , protectRoute , postController().getFeed);
router.get("/:id" , postController().getPost);
router.post("/create" , protectRoute , postController().createPost);
router.delete("/:id" ,protectRoute,  postController().deletePost);
router.post("/like/:id" , protectRoute , postController().likeAndUnlikePost);
router.post("/reply/:id" , protectRoute , postController().replyToPost);
router.delete("/reply/:id/" , protectRoute , postController().deleteReply);
router.post("/user/:username" , postController().getUserAllPost);

export default router;