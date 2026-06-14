import { Request, response, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// Register
// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: "Provide all details" });
  const existingEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingEmail)
    return res.status(400).json({ message: "Email already exist" });
  const existingNumber = await prisma.user.findUnique({
    where: { phone: phone },
  });
  if (existingNumber)
    return res.status(400).json({ message: "Phone number already exist" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashedPassword },
  });
  const token = generateToken(user.id);
  const userData: any = { ...user };
  delete userData.password;
  userData.isAdmin = getAdminStatus(userData.email);
  res.status(202).json({ user: userData, token });
};

// Login
// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!!email || !password)
    return res.status(400).json({ message: "Provide all details" });

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase(), include: { addresses: true } },
  });
  if (!user) return res.status(401).json({ message: "User doesn't exist" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = generateToken(user.id);
  const userData: any = { ...user };
  delete userData.password;
  userData.isAdmin = getAdminStatus(userData.email);
  res.status(202).json({ user: userData, token });
};
