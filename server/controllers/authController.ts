import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inngest } from "../inngest/index.js";

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// Check if user is admin
const getAdminStatus = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) =>
        e.trim().toLocaleLowerCase(),
      )
    : [];
  return adminEmails.includes(email.toLocaleLowerCase());
};

// send otp
// POST /api/auth/register
export const sendRegisterOTP = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Provide all details" });
  }
  const normalizedEmail = email.toLowerCase();
  const existingEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const existingPhone = await prisma.user.findUnique({
    where: { phone },
  });
  if (existingPhone) {
    return res.status(400).json({ message: "Phone number already exists" });
  }
  // Check existing OTP
  const existingOTP = await prisma.emailOTP.findUnique({
    where: { email: normalizedEmail },
  });
  // Prevent resend within 60 seconds
  if (existingOTP) {
    const secondsPassed = Math.floor(
      (Date.now() - existingOTP.createdAt.getTime()) / 1000,
    );
    if (secondsPassed < 60) {
      return res.status(429).json({
        message: `Please wait ${60 - secondsPassed}s before requesting another OTP.`,
      });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.emailOTP.upsert({
    where: { email: normalizedEmail },
    update: {
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      createdAt: new Date(), // reset resend timer
    },
    create: {
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await inngest.send({
    name: "otp/send",
    data: {
      email: normalizedEmail,
      name,
      otp,
    },
  });

  return res.status(200).json({
    success: true,
  });
};

// Verify OTP and register
//
export const verifyRegisterOTP = async (req: Request, res: Response) => {
  const { name, email, phone, password, otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: "OTP is required",
    });
  }
  const otpData = await prisma.emailOTP.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (!otpData) {
    return res.status(400).json({
      message: "OTP not found",
    });
  }
  if (otpData.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }
  if (otpData.expiresAt < new Date()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    },
  });

  await prisma.emailOTP.delete({
    where: {
      email: email.toLowerCase(),
    },
  });
  const token = generateToken(user.id);
  const userData: any = { ...user };
  delete userData.password;
  userData.isAdmin = getAdminStatus(user.email);
  res.status(201).json({
    user: userData,
    token,
  });
};

// Login
// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Provide all details" });

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { addresses: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = generateToken(user.id);
  const userData: any = { ...user };
  delete userData.password;
  userData.isAdmin = getAdminStatus(userData.email);
  res.status(202).json({ user: userData, token });
};

export const sendForgotPasswordOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });
  if (!user)
    return res.status(404).json({
      message: "User not found",
    });
  const existingOTP = await prisma.emailOTP.findUnique({
    where: {
      email: normalizedEmail,
    },
  });
  if (existingOTP) {
    const secondsPassed = Math.floor(
      (Date.now() - existingOTP.createdAt.getTime()) / 1000,
    );
    if (secondsPassed < 60) {
      return res.status(429).json({
        message: `Please wait ${60 - secondsPassed}s before requesting another OTP.`,
      });
    }
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.emailOTP.upsert({
    where: {
      email: normalizedEmail,
    },
    update: {
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      createdAt: new Date(),
    },
    create: {
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await inngest.send({
    name: "otp/send",
    data: {
      email: normalizedEmail,
      name: user.name,
      otp,
    },
  });

  res.json({
    success: true,
  });
};

export const verifyForgotPasswordOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Provide all details",
    });
  }
  const otpData = await prisma.emailOTP.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!otpData)
    return res.status(400).json({
      message: "OTP not found",
    });

  if (otpData.otp !== otp)
    return res.status(400).json({
      message: "Invalid OTP",
    });

  if (otpData.expiresAt < new Date())
    return res.status(400).json({
      message: "OTP expired",
    });

  return res.json({
    success: true,
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({
      message: "Provide all details",
    });
  }
  const otpData = await prisma.emailOTP.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (!otpData)
    return res.status(400).json({
      message: "OTP not found",
    });
  if (otpData.otp !== otp)
    return res.status(400).json({
      message: "Invalid OTP",
    });
  if (otpData.expiresAt < new Date())
    return res.status(400).json({
      message: "OTP expired",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      email: email.toLowerCase(),
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.emailOTP.delete({
    where: {
      email: email.toLowerCase(),
    },
  });

  return res.json({
    success: true,
    message: "Password updated successfully",
  });
};
