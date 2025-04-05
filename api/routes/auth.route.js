import express from "express";
import {
  googleSignIn,
  signOut,
  signin,
  singup,
} from "../controllers/auth.controller.js";

const route = express.Router();

// ==== Authentication Routes ==== //
route.post("/signup", singup);
route.post("/signin", signin);
route.post("/google-signin", googleSignIn);  // Updated route name
route.post("/signout", signOut);  // Use POST for logout (better security)

export default route;
