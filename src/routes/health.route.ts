import e, { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;
