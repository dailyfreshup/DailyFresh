import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

export const contactAdmin = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required.",
      });
    }

    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await inngest.send({
      name: "contact/message.sent",
      data: {
        userId: user.id,
        subject,
        message,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
