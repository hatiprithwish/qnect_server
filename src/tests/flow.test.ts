import { expect, test } from "vitest";
import { createOrUpdateFlow } from "../controllers/flow.controller";
import FlowService from "../services/flow.service";
import { debug } from "../utils/debug";

// test("Create or Update Flow", async () => {
//   //   expect(createOrUpdateFlow(1, 2)).toBe(3)
//   const nodes = ["client", "server", "database"];
//   const connections = [
//     ["client", "server"],
//     ["server", "database"],
//   ];
//   const systemName = "Rate Limiter";

//   const response = await FlowService.getAIFeedback(nodes, connections, systemName);

//   console.log(response);

//   //   expect(response).toBe("Feedback generated successfully");
// });

test("create Flow JSON From AI Feedback", async () => {
  await FlowService.createFlowJSONFromAIFeedback(
    "```{ \n  nodes: [ \n    { \n      data: { \n        label: 'Load Balancer', \n      }, \n    },\n    { \n      data: { \n        label: 'Server', \n      }, \n    },\n    { \n      data: { \n        label: 'Database', \n      }, \n    },\n    { \n      data: { \n        label: 'Cache', \n      }, \n    },\n    { \n      data: { \n        label: 'Client', \n      }, \n    },\n  ],\n  edges: [ \n    { \n      source: 'Client', \n      target: 'Load Balancer' \n    },\n    { \n      source: 'Load Balancer', \n      target: 'Server' \n    },\n    { \n      source: 'Server', \n      target: 'Cache' \n    },\n    { \n      source: 'Server', \n      target: 'Database' \n    },\n    { \n      source: 'Cache', \n      target: 'Database' \n    },\n  ],\n};```",
  );
});
