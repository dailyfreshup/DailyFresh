import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

// Create order
// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    const productIds = items.map((item: any) => item.product);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const productMap: Record<string, (typeof products)[0]> = {};

    products.forEach((product) => {
      productMap[product.id] = product;
    });

    // Check stock availability only
    for (const item of items) {
      const product = productMap[item.product];

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if ((product.stock ?? 0) < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }
    }

    const orderItems = items.map((item: any) => {
      const dbProduct = productMap[item.product];

      return {
        product: dbProduct.id,
        name: dbProduct.name,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity: item.quantity,
        unit: dbProduct.unit,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    const deliveryFee =
      subtotal > Number(process.env.FREE_DELIVERY_THRESHOLD || 1000)
        ? 0
        : Number(process.env.DELIVERY_FEE || 50);

    const platformFee = Number(process.env.PLATFORM_FEE || 3);

    const total = Math.round(subtotal + deliveryFee + platformFee);

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        platformFee,
        total,

        status: "Placed",

        statusHistory: [
          {
            status: "Placed",
            note: "Order placed successfully",
            timestamp: new Date(),
          },
        ],
      },
    });

    return res.status(201).json({
      order,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to create order",
    });
  }
};

// Get all orders of user
// GET /api/orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {
      userId: req.user!.id,

      // Don't show unpaid card orders
      NOT: [
        {
          paymentMethod: "card",
          isPaid: false,
        },
      ],
    };

    if (typeof status === "string" && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      orders,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to fetch orders",
    });
  }
};

// Get single user order
// GET /api/orders/:id
export const getUserOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.user!.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      order,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to fetch order",
    });
  }
};

// Update order status (Admin)
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;

    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id as string,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const currentStatus = order.status;

    // Allowed status transitions
    const allowedTransitions: Record<string, string[]> = {
      Placed: ["Confirmed", "Cancelled"],
      Confirmed: ["Delivered", "Cancelled"],
      Delivered: [],
      Cancelled: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change order from ${currentStatus} to ${status}`,
      });
    }

    const orderItems = order.items as any[];

    // -----------------------------
    // Deduct stock when Confirmed
    // -----------------------------
    if (currentStatus === "Placed" && status === "Confirmed") {
      // Check stock first
      for (const item of orderItems) {
        const product = await prisma.product.findUnique({
          where: {
            id: item.product,
          },
        });

        if (!product) {
          return res.status(404).json({
            message: `${item.name} not found`,
          });
        }

        if ((product.stock ?? 0) < item.quantity) {
          return res.status(400).json({
            message: `${product.name} is out of stock`,
          });
        }
      }

      // Deduct stock
      const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD || 10);

      for (const item of orderItems) {
        const productBefore = await prisma.product.findUnique({
          where: {
            id: item.product,
          },
        });

        const updatedProduct = await prisma.product.update({
          where: {
            id: item.product,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (
          productBefore &&
          productBefore.stock !== null &&
          updatedProduct.stock !== null &&
          productBefore.stock >= LOW_STOCK_THRESHOLD &&
          updatedProduct.stock < LOW_STOCK_THRESHOLD
        ) {
          await inngest.send({
            name: "inventory/stock.updated",
            data: {
              productId: item.product,
            },
          });
        }
      }
    }

    // -----------------------------
    // Restore stock if Cancelled
    // after confirmation
    // -----------------------------
    if (currentStatus === "Confirmed" && status === "Cancelled") {
      for (const item of orderItems) {
        await prisma.product.update({
          where: {
            id: item.product,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    const history = Array.isArray(order.statusHistory)
      ? [...(order.statusHistory as any[])]
      : [];

    history.push({
      status,
      note: note || `Order ${status.toLowerCase()}`,
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status,
        statusHistory: history,
      },
    });

    return res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to update order",
    });
  }
};

// Get all orders (Admin)
// GET /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        NOT: [
          {
            paymentMethod: "card",
            isPaid: false,
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      orders,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Failed to fetch all orders",
    });
  }
};
