import { Router } from "express"
import { createUser, loginUser } from "../controller/authController"

const router = Router()

router.route("/sign-up").post(createUser)
router.route("/login").post(loginUser)

export default router
