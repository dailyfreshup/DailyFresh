import express from "express";
import {
  createProduct,
  getProduct,
  getProducts,
  markOutOfStock,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import upload from "../middleware/uploads.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", auth, admin, upload.single("image"), createProduct);
productRouter.put("/:id", auth, admin, upload.single("image"), updateProduct);
productRouter.delete("/:id", auth, admin, markOutOfStock);

export default productRouter;
