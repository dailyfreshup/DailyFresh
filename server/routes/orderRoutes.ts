import express from "express";
import auth from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  getUserOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import admin from "../middleware/admin.js";

const orderRouter = express.Router();

orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/:id", auth, getUserOrder);
orderRouter.get("/", auth, admin, getAllOrders);
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);
// orderRouter.get('/:id/location', auth, getOrderLocation);

export default orderRouter;
