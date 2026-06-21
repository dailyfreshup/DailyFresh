import express from "express";
import { login, sendRegisterOTP, verifyRegisterOTP } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/send-otp", sendRegisterOTP);
authRouter.post("/verify-otp", verifyRegisterOTP);
authRouter.post("/login", login);

export default authRouter;
