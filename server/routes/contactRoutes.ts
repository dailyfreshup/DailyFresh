import express from "express";
import auth from "../middleware/auth.js";
import { contactAdmin } from "../controllers/contactController.js";

const contactRouter = express.Router();
contactRouter.post("/", auth, contactAdmin);

export default contactRouter;
