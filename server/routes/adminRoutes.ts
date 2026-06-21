import express from "express";
import {
  getAdminOrder,
  getAdminStats,
  sendAnnouncement,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const adminRouter = express.Router();

adminRouter.get("/stats", auth, admin, getAdminStats);
adminRouter.get("/orders/:id", auth, admin, getAdminOrder);
adminRouter.post("/announcement", auth, admin, sendAnnouncement);

export default adminRouter;
