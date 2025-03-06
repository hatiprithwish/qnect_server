import { Router } from "express";
import { createOrUpdateFlow, updateFlow } from "../controllers/flow.controller";
import { verifyUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").post(verifyUser, createOrUpdateFlow);
// router.route("/:id").get(getFlow);
router.route("/:id").put(updateFlow);
// router.route("/:id/share").post(shareFlow);
// router.route("/:id/evaluate").post(evaluateFlow);

export default router;
