import { Request, Response } from "express"
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import prisma from "../config/prismaClient"

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send("Email and Password are required")
    }
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    // Send verification email
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }

    // Create user in database
    const dbUser = await prisma.user.create({
      data: {
        firebaseUid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName || user.email || ""
      }
    })

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        uid: user.uid,
        email: user.email,
        displayName: dbUser.displayName
      }
    })
  } catch (error: any) {
    console.error("User creation error:", error)
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      })
    }

    // Firebase authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()

    if (!idToken) {
      throw new Error("Failed to generate authentication token")
    }

    // Set secure cookie
    res.cookie("access_token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000 * 24,
      path: "/"
    })

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        email: userCredential.user.email || "",
        uid: userCredential.user.uid
      }
    })
  } catch (error: any) {
    console.error("Login error:", error)

    // Handle specific Firebase auth errors
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return res.status(401).json({
          success: false,
          error: "Invalid email or password"
        })
      case "auth/too-many-requests":
        return res.status(429).json({
          success: false,
          error: "Too many login attempts. Please try again later."
        })
      default:
        return res.status(500).json({
          success: false,
          error: "Internal server error"
        })
    }
  }
}

export const logoutUser = async (_: Request, res: Response): Promise<void> => {
  try {
    await signOut(auth)

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })

    res.status(200).json({
      success: true,
      message: "User logged out successfully"
    })
  } catch (error: any) {
    console.error("Logout error:", error?.message)

    res.status(500).json({
      success: false,
      message: "Failed to logout user",
      error: error?.message
    })
  }
}
