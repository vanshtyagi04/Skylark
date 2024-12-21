import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const getUserProfile = asyncHandler(async (req , res) => {
    const { query } = req.params;
        let user;
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id: query}).select("-password").select("-updateAt");
        } else {
            user = await User.findOne({ username: query}).select("-password").select("-updateAt");
        }
        if(!user){
            return res
            .status(404)
            .json("User not found")
        }
        res.status(200).json(user);
});

const signupUser = asyncHandler( async (req , res) => {
    const { name,email,username, password} = req.body;
    const user = await User.findOne({ $or: [{ email}, { username}]});

    if(user) {
        return res.status(400).json({error: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        username,
        password: hashedPassword,
    })

    await newUser.save();

    if(newUser) {
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            profilePic: newUser.profilePic,
        });
    } else{
        res.status(400).json({ error: "Invalid user data"});
    }
})

const loginUser = asyncHandler( async (req , res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");
    if(!user || !isPasswordValid) return res.status(400).json({ error: "Invalid username or password"});

    if(user.isFrozen) {
        user.isFrozen = false;
        await user.save();
    }

    generateTokenAndSetCookie(user._id , res);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
    });
})

const logoutUser = asyncHandler( async(req,res) => {
    res.cookie("jwt", "", {maxAge: 1});
    res.status(200).json({ message: "User logged out successfully"});
})

const followUnFollowUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
     if(id === req.user._id.toString()){
        return res.status(400).json({ eroor: "You cannot follow/unfollow yourself"});
     }

     if(!userToModify || !currentUser) return res.status(400).json({error: "You cannot follow/unfollow yourself"});
     const isFollowing = currentUser.following.includes(id);

     if(isFollowing){
        await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id}});
        await User.findByIdAndUpdate(req.user._id, {$pull: {foolowing: id}});
        res.status(200).json({message: "User unfollowed successfully"});
     }else{
        await User.findByIdAndUpdate(id, { $push: { followers: req.user._id}});
        await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
        res.status(200).json({message: "User followed successfully"});
     }
})

const updateUser = asyncHandler(async (req, res) => {
    const { name, email, username, password , bio} = req.body;
    let { profilePic } = req.body;

    const userId = req.user._id;

    try{
        let user = await User.findById(userId);
        if(!user) return res.status(400).json({ error: "User not found"});
        if(req.params.id !== userId.toString){
            return res.status(400).json({error: "You cannot update other user's profile"});
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        if(profilePic){
            if(user.profilePic){
                cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
        }
        user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();
        await Post.updateMany(
            {"replies.userId": userId},
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic,
                },
            },
            {arrayFilters: [{ "reply.userId": userId }]}
        );

        user.password = null;

        res.status(200).json(user);
    }
    catch(err) {
        res.status(500).json({ error: err.message});
        console.log("Error in updateUser: ", err.message);
    }
})

const getSuggestedUsers = asyncHandler(async (req , res) => {
    const userId = req.user._id;
    const usersFollowedByYou = await User.findById(userId).select("following");
    const users = await User.aggregate([
        {
            $match: {
                _id: { $ne: userId},
            }
        },
        {
            $sample: { size: 10},
        },
    ]);

    const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0,4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
})

const freezeAccount = asyncHandler(async (req , res) => {
    const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();
        res.status(200).json({ success: true });
})

const findUsersByName = asyncHandler(async (req, res) => {
    const { name } = req.body;

    try {
        const users = await User.find({ username: { $regex: name, $options: 'i' } }).select("-password");
        if (users.length !== 0) {
            res.status(200)
               .json(users);
        } else {
            res.status(404)
               .json({ err :"No user found"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

export {
	signupUser,
	loginUser,
	logoutUser,
	followUnFollowUser,
	updateUser,
	getUserProfile,
	getSuggestedUsers,
	freezeAccount,
    findUsersByName,
};