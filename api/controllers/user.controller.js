import Listing from "../models/listing.models.js";
import User from "../models/user.models.js";
import { throwError } from "../utils/error.js";
import bcrypt from "bcrypt";

//====== Get User ======//
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(throwError(404, "User not found"));

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error("Error in getUser:", error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) return next(throwError(401, "User Invalid"));

    // Only check for existing email if provided
    if (req.body.email) {
      const checkEmail = await User.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
      if (checkEmail) return next(throwError(400, "Email already in use"));
    }

    // Only check for existing username if provided
    if (req.body.username) {
      const checkUserName = await User.findOne({ username: req.body.username, _id: { $ne: req.params.id } });
      if (checkUserName) return next(throwError(400, "Username already in use"));
    }

    // Hash password if updating it
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    // Update user with provided fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) return next(throwError(404, "User not found"));

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error("Error in updateUser:", error);
    next(error);
  }
};

//====== Delete User ======//
export const deleteUser = async (req, res, next) => {
  try {
    console.log(`Deleting user with ID: ${req.params.id}`);

    if (req.user.id !== req.params.id) return next(throwError(401, "User Invalid"));

    const user = await User.findById(req.params.id);
    if (!user) return next(throwError(404, "User not found"));

    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User Deleted Successfully!" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    next(error);
  }
};

//====== Get User Created Posts ======//
export const userPosts = async (req, res, next) => {
  try {
    console.log(`Fetching posts for user ID: ${req.params.id}`);

    if (req.user.id !== req.params.id) return next(throwError(401, "You can see only your posts"));

    const posts = await Listing.find({ userRef: req.params.id });

    if (!posts.length) return next(throwError(404, "No posts found"));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in userPosts:", error);
    next(error);
  }
};
