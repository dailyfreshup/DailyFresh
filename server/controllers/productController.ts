import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { uploadImage } from "../utils/uploadImage.js";
import cloudinary from "../config/cloudinary.js";

const parseNumberField = (value: unknown, field: string): number | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
};

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  const { category, search, limit, popular } = req.query;
  const where: any = {};
  if (category && category !== "all") {
    where.category = category as string;
  }
  if (search) {
    const terms = (search as string)
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    where.OR = terms.flatMap((term) => [
      {
        name: {
          contains: term,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: term,
          mode: "insensitive",
        },
      },
      {
        tags: {
          has: term,
        },
      },
    ]);
  }
  if (popular === "true") {
    where.isPopular = true;
    // where.stock = {
    //   gt: 0,
    // };
  }
  where.stock = {
    gt: 0,
  };
  const products = await prisma.product.findMany({
    where,
    take: limit ? Number(limit) : undefined,
  });
  const productWithDiscount = products.map((p) => ({
    ...p,
    discount:
      p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0,
  }));
  res.json({ products: productWithDiscount });
};

// GET /api/products/:id
export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id as string },
  });
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  const discount =
    product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;
  res.json({ product: { ...product, discount } });
};

// POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      tags,
      isPopular,
    } = req.body;
    const parsedPrice = parseNumberField(price, "price");
    const parsedOriginalPrice = parseNumberField(
      originalPrice,
      "originalPrice",
    );
    const parsedStock = parseNumberField(stock, "stock");
    if (
      parsedPrice === null ||
      parsedOriginalPrice === null ||
      parsedStock === null
    ) {
      return res.status(400).json({
        message: "price, originalPrice and stock must all be valid numbers.",
      });
    }
    let imageUrl = "";
    let uploadedPublicId: string | null = null;
    if (req.file) {
      const uploaded = await uploadImage(req.file.buffer);
      imageUrl = uploaded.secure_url;
      uploadedPublicId = uploaded.public_id;
    }
    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          image: imageUrl,
          price: parsedPrice,
          originalPrice: parsedOriginalPrice,
          category,
          stock: parsedStock,
          tags: Array.isArray(tags)
            ? tags
            : typeof tags === "string"
              ? JSON.parse(tags)
              : [],
          isPopular: isPopular === true || isPopular === "true",
        },
      });
      return res.status(201).json(product);
    } catch (err) {
      if (uploadedPublicId) {
        await cloudinary.uploader.destroy(uploadedPublicId);
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.product.findUnique({
      where: {
        id: req.params.id as string,
      },
    });
    if (!existing) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      tags,
      isPopular,
    } = req.body;
    const parsedPrice = parseNumberField(price, "price");
    const parsedOriginalPrice = parseNumberField(
      originalPrice,
      "originalPrice",
    );
    const parsedStock = parseNumberField(stock, "stock");
    if (
      parsedPrice === null ||
      parsedOriginalPrice === null ||
      parsedStock === null
    ) {
      return res.status(400).json({
        message: "price, originalPrice and stock must all be valid numbers.",
      });
    }
    let imageUrl = existing.image;
    let newPublicId: string | null = null;
    if (req.file) {
      const uploaded = await uploadImage(req.file.buffer);
      imageUrl = uploaded.secure_url;
      newPublicId = uploaded.public_id;
    }
    try {
      const product = await prisma.product.update({
        where: {
          id: req.params.id as string,
        },
        data: {
          name,
          description,
          image: imageUrl,
          price: parsedPrice,
          originalPrice: parsedOriginalPrice,
          category,
          stock: parsedStock,
          tags: Array.isArray(tags)
            ? tags
            : typeof tags === "string"
              ? JSON.parse(tags)
              : [],
          isPopular: isPopular === true || isPopular === "true",
        },
      });
      if (req.file && existing.image) {
        const parts = existing.image.split("/");
        const file = parts[parts.length - 1];
        const publicId = "products/" + file.substring(0, file.lastIndexOf("."));
        await cloudinary.uploader.destroy(publicId);
      }
      return res.json(product);
    } catch (err) {
      if (newPublicId) {
        await cloudinary.uploader.destroy(newPublicId);
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};

// Delete /api/products/:id
export const markOutOfStock = async (req: Request, res: Response) => {
  await prisma.product.update({
    where: { id: req.params.id as string },
    data: { stock: Number(0) },
  });
  res.json({ message: "Product updated" });
};
