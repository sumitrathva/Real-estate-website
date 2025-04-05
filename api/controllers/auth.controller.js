import admin from "../utils/firebaseAdmin.js";
import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import { throwError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { passwordGenarator, usernameGenarator } from "../utils/helper.js";

//======handle singup route ===========//
export const singup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ========sing in route handling here =====//
export const signin = async (req, res, next) => {
  const { email, userPassword } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(throwError(404, "Worng Credentials!"));
    const isValidPassword = bcrypt.compareSync(
      userPassword,
      validUser.password
    );
    if (!isValidPassword) return next(throwError(401, "Worng Credentials!"));

    const { password, ...rest } = validUser._doc;
    const tooken = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "720h",
    });
    res
      .cookie("access_token", tooken, { httpOnly: true, secure: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//=====Handle Google Singin Here ======//
export const googleSignIn = async (req, res, next) => {
  const { idToken } = req.body;
  try {
    // Verify ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;
    const user = await User.findOne({ email });

    // If user exists
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "720h",
      });
      const { password, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true, secure: true })
        .status(200)
        .json(rest);
    } 
    // If new user
    else {
      const hashedPassword = bcrypt.hashSync(passwordGenarator(), 10);
      const newUser = new User({
        name,
        username: usernameGenarator(name),
        email,
        password: hashedPassword,
        avatar: picture, // ✅ Fixed here
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "720h",
      });
      const { password, ...rest } = savedUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true, secure: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(throwError(500, "Google Sign-In failed"));
  }
};

//=====handle signout=====//
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("Successfully logged out!");
  } catch (error) {
    next(error);
  }
};
