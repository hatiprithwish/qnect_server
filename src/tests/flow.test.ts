import { expect, test } from "vitest";
import { createOrUpdateFlow } from "../controllers/flow.controller";
import FlowService from "../services/flow.service";
import { debug } from "../utils/debug";

test("Create or Update Flow", async () => {
  //   expect(createOrUpdateFlow(1, 2)).toBe(3)
  const nodes = ["client", "server", "database"];
  const connections = [
    ["client", "server"],
    ["server", "database"],
  ];
  const systemName = "Rate Limiter";

  const response = await FlowService.getAIFeedback(nodes, connections, systemName);

  console.log(response);

  //   expect(response).toBe("Feedback generated successfully");
});
