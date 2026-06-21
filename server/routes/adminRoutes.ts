import express from "express";
import {
  getAdminOrder,
  getAdminStats,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const adminRouter = express.Router();

adminRouter.get("/stats", auth, admin, getAdminStats);
adminRouter.get("/orders/:id", auth, admin, getAdminOrder);

export default adminRouter;
