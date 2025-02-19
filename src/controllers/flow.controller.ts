import { Request, Response } from "express";
import FlowService from "../services/flow.service";
import UserService from "../services/user.service";
import { nanoid } from "nanoid";
import { UserRequest } from "../middlewares/auth.middleware";
import { debug } from "../utils/debug";

export const createOrUpdateFlow = async (req: UserRequest, res: Response) => {
  try {
    const { flow: flowJson, flowId, systemName } = req.body;
    const user = req.user;
    if (!flowJson) {
      res.status(400).json({ message: "Flow and userId are required" });
      return;
    }

    const dbUser = await UserService.findUser({ id: user.uid });
    if (!dbUser) {
      res.status(404).json({ message: "User not found in database" });
      return;
    }

    const { nodes, connections } = FlowService.sanitizeFlow(flowJson);
    const feedback = FlowService.evaluateFlow(nodes, connections);
    if (
      feedback.goodToHaveComponents.length > 0 ||
      feedback.mustHaveComponents.length > 0 ||
      feedback.prohibitedConnections.length > 0 ||
      feedback.goodToHaveConnections.length > 0
    ) {
      res
        .status(200)
        .json({ success: true, message: "Flow submitted successfully", data: feedback });
      return;
    }

    // LATER -> Handle AI Feedback in frontend
    if (!flowId) {
      const newFlowId = nanoid();

      await FlowService.getAIFeedback(nodes, connections, systemName);
      await FlowService.createFlow(flowJson, newFlowId, user.uid);
    }
  } catch (error: any) {
    console.error("Error in createFlow controller:", error);
    res.status(500).json({ message: error?.message || "Failed to create flow" });
  }
};

export const updateFlow = async (req: Request, res: Response) => {
  try {
    const { id: flowId } = req.params;
    const updateFields = req.body;

    if (!flowId) {
      res.status(400).json({ message: "flowId is required" });
      return;
    }

    const response = await FlowService.updateFlow(flowId, updateFields);

    res.status(201).json({
      success: true,
      message: "Flow updated successfully",
      data: response,
    });
  } catch (error: any) {
    console.error("Error in updateFlow controller:", error);
    res.status(500).json({ message: error?.message || "Failed to update flow" });
  }
};
