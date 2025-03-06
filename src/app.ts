import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import flowRouter from "./routes/flow.route";
import healthRouter from "./routes/health.route";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

// const corsOptions = {
//   origin: "http://localhost:5173/",
//   credentials: true, // Allow cookies
//   methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"],
// };
app.use(cors());

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚦 Server is running on port ${PORT}`);
});

// Routes
const baseRouter = express.Router();
baseRouter.use("/", healthRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/flow", flowRouter);

app.use("/api/v1", baseRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: "API route not found",
  });
});

app.use(errorHandler); // global error handler

export default app;
