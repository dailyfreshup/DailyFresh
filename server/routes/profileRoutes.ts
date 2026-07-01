import express from "express";
import { updateProfile } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.put("/:id", updateProfile);

export default profileRouter;
