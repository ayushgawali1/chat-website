import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/channelController.js";

const channelRoute = Router();



channelRoute.post("/create-channel", verifyToken, createChannel);
channelRoute.get("/get-user-channels", verifyToken, getUserChannels);
channelRoute.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);


export default channelRoute;
