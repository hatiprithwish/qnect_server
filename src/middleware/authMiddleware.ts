import { NextFunction, Request, Response } from "express"
import { admin } from "../config/firebase"
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"

interface CustomRequest extends Request {
  user?: DecodedIdToken
}

export const verifyAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const idToken = req.cookies?.Authorization
  if (!idToken) {
    return res.status(403).json({ error: "access token not found in cookies" })
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    return next()
  } catch (error) {
    console.error("Error verifying token:", error)
    return res.status(403).json({ error: "Unauthorized" })
  }
}
