import { Router, Request, Response } from "express";

const router = Router();

router.route("/").get((_: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default router;
