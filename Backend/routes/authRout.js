import { Router } from "express";
import { addProfileImage, login, logout, removeProfileImage, signup, updateProfile, userInfo } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const authRoutes = Router();

const upload = multer({ dest: "upload/profile/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyToken, userInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image"),
    addProfileImage
);

authRoutes.delete(
    "/remove-profile-image",
    verifyToken,
    removeProfileImage
);



authRoutes.post("/logout", logout);

export default authRoutes;
