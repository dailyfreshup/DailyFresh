import express from "express";
import {
  login,
  resetPassword,
  sendForgotPasswordOTP,
  sendRegisterOTP,
  verifyForgotPasswordOTP,
  verifyRegisterOTP,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/send-otp", sendRegisterOTP);
authRouter.post("/verify-otp", verifyRegisterOTP);
authRouter.post("/login", login);
authRouter.post("/forgot-password/send-otp", sendForgotPasswordOTP);
authRouter.post("/forgot-password/verify-otp", verifyForgotPasswordOTP);
authRouter.post("/forgot-password/reset", resetPassword);

export default authRouter;
