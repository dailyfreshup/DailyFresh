import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { uploadImage } from "../utils/uploadImage.js";

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
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
        ? [req.body.tags]
        : [];
    const product = await prisma.product.create({
      data: {
        ...req.body,
        image: imageUrl,
        tags,
        price: Number(req.body.price),
        originalPrice: Number(req.body.originalPrice),
        stock: Number(req.body.stock),
        isPopular: req.body.isPopular === "true",
      },
    });
    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
        ? [req.body.tags]
        : [];
    const product = await prisma.product.update({
      where: {
        id: req.params.id as string,
      },
      data: {
        ...req.body,
        image: imageUrl,
        tags,
        price: Number(req.body.price),
        originalPrice: Number(req.body.originalPrice),
        stock: Number(req.body.stock),
        isPopular: req.body.isPopular === "true",
      },
    });
    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
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
