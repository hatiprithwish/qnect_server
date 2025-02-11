import express, { Application, Request, Response, NextFunction } from "express"
import path from "path"
import globalErrorHandler from "./middleware/globalErrorHandler"
import httpError from "./util/httpError"
import ResponseMessage from "./constant/responseMessage"
import healthRouter from "./router/healthRouter"
import helmet from "helmet"
import cors from "cors"
import flowRouter from "./router/flowRouter"
import authRouter from "./router/authRouter"

const app: Application = express()

//Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
  })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, "../", "public")))

//Main Router
const mainRouter = express.Router()

// Registering Sub Router
mainRouter.use("/flow", flowRouter)
mainRouter.use("/auth", authRouter)
mainRouter.use(healthRouter)

// Registering Main Router
app.use("/api/v1", mainRouter)

// 404 Not Found Route
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(ResponseMessage.NOT_FOUND("Route"))
  } catch (error) {
    httpError(next, error, req, 404)
  }
})

// GLOBAL ERROR HANDLER FallBack
app.use(globalErrorHandler)

export default app
