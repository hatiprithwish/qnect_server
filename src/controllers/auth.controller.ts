import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { auth } from "../config/firebase.config";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Email, password and name are required" });
      return;
    }

    const user = await AuthService.registerUser(email, password, name);
    res.status(200).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: user,
    });
  } catch (error: any) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Firebase ID token is required." });
      return;
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userRecord = await auth.getUser(decodedToken.uid);

    const response = { uid: userRecord.uid, email: userRecord.email };

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      data: response,
    });
  } catch (error: any) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
};
