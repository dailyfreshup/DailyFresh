import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const phoneExists = await prisma.user.findFirst({
      where: {
        phone,
        NOT: {
          id,
        },
      },
    });

    if (phoneExists) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
      },
      select: {
        name: true,
        phone: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
