import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

// get admin dashboard data
// GET /api/admin/stats
export const getAdminStats = async (req: Request, res: Response) => {
  const [totalOrders, totalUsers, totalProducts, outOfStock, recentOrders] =
    await Promise.all([
      prisma.order.count({
        where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.order.findMany({
        where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { name: true, email: true, phone: true } } },
      }),
    ]);
  res.json({
    totalOrders,
    totalUsers,
    totalProducts,
    outOfStock,
    recentOrders,
  });
};

// GET /api/admin/orders/:id
export const getAdminOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
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

// POST /api/admin/announcement
export const sendAnnouncement = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required",
      });
    }
    await inngest.send({
      name: "announcement/send",
      data: {
        subject: "Test",
        message: "Hello",
      },
    });

    console.log("Announcement event sent");
    return res.json({
      message: "Announcement is being sent.",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
