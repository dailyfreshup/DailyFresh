// get admin dashboard data

import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

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
