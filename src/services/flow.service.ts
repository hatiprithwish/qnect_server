import axios from "axios";
import prisma from "../config/prisma.config";
import {
  aiFeedbackTemplate,
  goodToHaveConnections,
  goodToHaves,
  mustHaves,
  prohibitedConnections,
} from "../constants/flow";
import { PermissionLevel, Flow, FlowJSON, Node } from "../types";
import { debug } from "../utils/debug";
import { Feedback } from "../types/flow";

class FlowService {
  static async createFlow(flowJson: FlowJSON, id: string, userId: string) {
    return prisma.flow.create({
      data: {
        id,
        body: JSON.stringify(flowJson),
        owner: { connect: { id: userId } },
      },
    });
  }

  static async updateFlow(id: string, data: any) {
    return prisma.flow.update({
      where: { id },
      data: data,
    });
  }

  static sanitizeFlow(input: any) {
    let nodes = [];
    input.nodes.map((node: any) => nodes.push(node.data?.label));

    let connections = [];
    input.edges.map((edge: any) => {
      const sourceNode = input.nodes.find((node: Node) => node.id === edge.source);
      const targetNode = input.nodes.find((node: Node) => node.id === edge.target);
      connections.push([sourceNode.data.label, targetNode.data.label]);
    });

    //LATER: Handle Edge labels

    return { nodes, connections };
  }

  static evaluateFlow(nodes: any[], connections: any[]) {
    const feedback: Feedback = {
      mustHaveComponents: [],
      goodToHaveComponents: [],
      prohibitedConnections: [],
      goodToHaveConnections: [],
    };

    mustHaves.forEach((component) => {
      if (!nodes.includes(component)) {
        feedback.mustHaveComponents.push(component);
      }
    });

    goodToHaves.forEach((component) => {
      if (!nodes.includes(component)) {
        feedback.goodToHaveComponents.push(component);
      }
    });

    for (let [source, target] of connections) {
      const prohibitedConnection = prohibitedConnections.find(
        (prohibitedConnection) =>
          prohibitedConnection.connection[0] === source &&
          prohibitedConnection.connection[1] === target,
      );
      if (prohibitedConnection) {
        feedback.prohibitedConnections.push(prohibitedConnection.message);
      }
    }

    const missingConnections = goodToHaveConnections.filter(
      ({ connection }) =>
        !connections.some(
          (conn) =>
            (conn[0] === connection[0] && conn[1] === connection[1]) ||
            (conn[0] === connection[1] && conn[1] === connection[0]), // Handle bidirectional connections
        ),
    );
    feedback.goodToHaveConnections = missingConnections.map(({ message }) => message);

    return feedback;
  }

  static async getAIFeedback(nodes: any[], connections: any[], systemName: string) {
    const requestBody = {
      model: "DeepSeek-R1",
      messages: [
        {
          role: "user",
          content: `Evaluate the system design for ${systemName}. 
          Here are the components and connections: ${{ nodes, connections }}
          Go through the design and provide feedback in ${aiFeedbackTemplate} format.
          `,
          stream: true,
        },
      ],
    };
    const response = await axios.post(
      `${process.env.KRUTRIM_BASE_API}/chat/completions`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.KRUTRIM_API_KEY}`,
        },
      },
    );

    return response.data.choices[0].message.content;
  }
}

export default FlowService;
