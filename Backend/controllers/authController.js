import { compare } from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password is required.");
        }
        const user = await userModel.create({ email, password });
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password is required.");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send("Invalid Credentials");
        }

        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(404).send("Invalid Credentials");
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.color,
                image: user.image,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

export const userInfo = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with given id is not found");
        }
        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            color: userData.color,
            image: userData.image,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { userId } = req;

        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("Fields are require");
        }

        const userData = await userModel.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup: true,
        }, { new: true, runValidators: true })


        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            color: userData.color,
            image: userData.image,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const addProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required.");
        }

        const date = Date.now();
        let fileName = "upload/profile/" + date + req.file.originalname;
        console.log(fileName);

        renameSync(req.file.path, fileName);

        const updatedUser = await userModel.findByIdAndUpdate(
            req.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            image: updatedUser.image,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const removeProfileImage = async (req, res) => {
    try {
        const { userId } = req;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        if (user.image) {
            unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return res.status(200).send("Profile image removed successfully.");
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }

}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        res.status(200).send("Logout successfull.");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}