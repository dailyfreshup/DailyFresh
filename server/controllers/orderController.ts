import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

// Create order
// POST api/orders
export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }
  const productIds = items.map((i: any) => i.product);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap: Record<string, (typeof products)[0]> = {};

  products.forEach((p: any) => (productMap[p.id] = p));
  for (const item of items) {
    const product = productMap[item.product];
    if (!product || (product.stock ?? 0) < item.quantity) {
      return res.status(404).json({ message: "Out of stock" });
    }
  }
  const orderItems = items.map((item: any) => {
    const dbProduct = productMap[item.product];
    if (!dbProduct) throw new Error(`Product ${item.product} not found`);
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
      : Number(process.env.DELIVERY_FEE || 1000);
  const platformFee = Number(process.env.PLATFORM_FEE || 3);
  const total = Math.round(subtotal + deliveryFee + platformFee);
  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      items: orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      subtotal,
      deliveryFee,
      platformFee,
      total,
      statusHistory: [
        {
          status: "Placed",
          note: "Order placed successfully",
          timestamp: new Date(),
        },
      ],
    },
  });
  if (paymentMethod === "card") {
    // add link of upi
  }
  res.json({ order });
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.product },
      data: { stock: { decrement: item.quantity } },
    });
  }
  // Mail to admin if the stock goes below threshold
  for (const item of orderItems) {
    await inngest.send({
      name: "inventory/stock.updated",
      data: {
        productId: item.product,
      },
    });
  }
  // Send mail to user if order placed
};

// Get all orders of user
// GET /api/orders
export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {
    userId: req.user!.id,
    NOT: [{ paymentMethod: "card", isPaid: false }],
  };
  if (status && status !== "all") {
    where.status = status;
  }
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

// Get user order
// GET /api/orders/:id
export const getUserOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  return res.json({ order });
};

// Update order status for admin only
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  const history = (
    Array.isArray(order.statusHistory) ? order.statusHistory : []
  ) as any[];
  history.push({
    status,
    note: note || `Order is ${status.toLocaleLowerCase()}`,
    timestamp: new Date(),
  });
  const updateOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: { status, statusHistory: history },
  });
  res.json({ order: updateOrder });
};

// Get all orders for admin
// GET /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

// Get order location
// GET /api/orders/:id/location
// export const getOrderLocation = async (req: Request, res: Response) => {
//   const order = await prisma.order.findFirst({
//     where: { id: req.params.id as string, userId:req.user!.id },
//     select:{livelocation:true, status:true}
//   });
//   if(!order)return res.status(404).json({message:"Order not found "});
//   res.json({liveLocation:order.livelocation,status:order.status})
// };
