import mongoose from "mongoose";
import channelModel from "../models/channelModel.js";
import userModel from "../models/userModel.js";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await userModel.findById(userId);

        if (!admin) {
            return res.status(400).send("Admin user not found.");
        }

        const validMembers = await userModel.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users.");
        }

        const newChannel = new channelModel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return res.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await channelModel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });

        return res.status(201).json({ channels });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


export const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await channelModel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id image color",
            },
        });
        
        if (!channel) {
            return res.status(404).send("Channel not found.");
        }

        res.status(200).send(channel);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}