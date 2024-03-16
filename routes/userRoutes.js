import express from "express";
import userController from "../controllers/userController.js";
import protectRoute from "../middlewares/projectRoute.js"

const router = express.Router();


router.get("/profile/:query" , userController().getUserProfile);
router.post("/signup" , userController().signupUser);
router.post("/login" , userController().loginUser);
router.post("/logout" , userController().logoutUser);
router.post("/follow/:id" , protectRoute,  userController().followUnfollowUser);
router.post("/update/:id" , protectRoute , userController().updateUserProfile);
router.get("/followers/list/:username" , userController().getFollowersList);
router.get("/all/users" , userController().getAllUsers);


export default router;