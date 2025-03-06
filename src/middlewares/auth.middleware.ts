import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase.config";

export interface UserRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name: string;
  };
}

export const verifyUser = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const idToken = authHeader.split(" ")[1]; // Extract token

    // Verify Firebase ID Token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userRecord = await auth.getUser(decodedToken.uid);
    if (!decodedToken) {
      res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
      return;
    }

    // Attach user data to request
    req.user = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || "User",
    };

    next();
  } catch (error: any) {
    console.error("Error in verifyUser middleware:", error);
    res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
};
