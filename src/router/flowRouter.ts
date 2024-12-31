import { Router } from "express"
import { getFlowChart, saveFlowChart } from "../controller/flowController"

const router = Router()

router.route("/").get(getFlowChart)
router.route("/").post(saveFlowChart)

export default router
