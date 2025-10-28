import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages, uploadFile } from "../controllers/messagesController.js";
import multer from "multer";

const MessgaeRoute = Router();

const upload = multer({ dest: "upload/files" });


MessgaeRoute.post("/get-message", verifyToken, getMessages);
MessgaeRoute.post("/upload-file", verifyToken, upload.single("file"), uploadFile);


export default MessgaeRoute;
