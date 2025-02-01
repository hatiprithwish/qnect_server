import { Router } from "express"
import { getFlowChart, saveFlowChart, evaluateFlowChart } from "../controller/flowController"
import { verifyAuth } from "../middleware/authMiddleware"

const router = Router()

router.route("/").get(getFlowChart)
router.route("/").post(saveFlowChart)
router.route("/eval").post(evaluateFlowChart)

export default router
