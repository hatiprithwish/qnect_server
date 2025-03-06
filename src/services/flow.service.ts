import axios from "axios";
import prisma from "../config/prisma.config";
import {
  faultyEdges,
  goodEdges,
  goodNodes,
  iconNodes,
  requiredNodes,
} from "../constants/flow.const";
import { AIFeedback, FlowFeedback, FlowJSON, Node } from "qnect-types";
import { nanoid } from "nanoid";

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
    input.nodes.map((node: any) =>
      nodes.push(node.data?.label.trim().toLowerCase().replace(/-/g, " ")),
    );

    let edges = [];
    input.edges.map((edge: any) => {
      const sourceNode = input.nodes.find((node: Node) => node.id === edge.source);
      const targetNode = input.nodes.find((node: Node) => node.id === edge.target);
      edges.push([
        sourceNode.data.label.trim().toLowerCase().replace(/-/g, " "),
        targetNode.data.label.trim().toLowerCase().replace(/-/g, " "),
      ]);
    });

    //LATER: Handle Edge labels

    return { nodes, edges };
  }

  static evaluateFlow(nodes: any[], edges: any[]) {
    const feedback: FlowFeedback = {
      requiredNodes: [],
      goodNodes: [],
      faultyEdges: [],
      missingEdges: [],
    };

    requiredNodes.forEach((node) => {
      if (!nodes.includes(node)) {
        feedback.requiredNodes.push(node);
      }
    });

    goodNodes.forEach((node) => {
      if (!nodes.includes(node)) {
        feedback.goodNodes.push(node);
      }
    });

    for (let [source, target] of edges) {
      const faultyEdge = faultyEdges.find(
        (edge) => edge.connection[0] === source && edge.connection[1] === target,
      );
      if (faultyEdge) {
        feedback.faultyEdges.push(faultyEdge.message);
      }
    }

    const missingEdges = goodEdges.filter(
      ({ connection }) =>
        !edges.some((conn) => conn[0] === connection[0] && conn[1] === connection[1]),
    );
    feedback.missingEdges = missingEdges.map(({ message }) => message);

    return feedback;
  }

  static async getAIFeedback(
    inputFlow: { nodes: string[]; edges: string[][] },
    problemStatement: string,
  ) {
    const requestBody = {
      model: "DeepSeek-R1-Llama-70B",
      messages: [
        {
          role: "user",
          content: `
            You are a **system design evaluator** with expertise in **architectural analysis and optimization**. Your task is to **analyze the system design** for ${problemStatement} based on the given nodes (system components) and edges (connections between components). Your evaluation should identify potential improvements, missing elements, and possible inefficiencies.  
            ### **System Design Overview:**  
            Nodes represent components, and edges represent their connections. Each edge follows the format:  
            - **Source**: The originating component  
            - **Target**: The receiving component  

            #### **Input Data:**  
            \`\`\`
            {
              "nodes": ${inputFlow.nodes},
              "edges": ${inputFlow.edges}
            }
            \`\`\`  

            ### **Task:**  
            1. **Analyze each node and edge**:  
              - Provide feedback on any inefficiencies, missing details, or potential issues.  
              - If no feedback is necessary for a node or edge, skip it.  

            2. **Suggest additional nodes and edges if needed**:  
              - If the design can be improved with extra components or connections, add them while maintaining the original format.
              - Additional nodes should be added to the **nodes** array, and additional edges to the **edges** array to maintain the structure.

            ### **Output Format:**  
            Your response should be **a valid JSON object** with structured feedback. **Do not add any extra characters, text, or explanations** outside the JSON object, as this will result in an error.  

            \`\`\`
            {
              "nodes": [
                {
                  "data": {
                    "label": "node name"
                  },
                  "feedback": "optional feedback"
                }
                // Additional nodes...
              ],
              "edges": [
                {
                  "source": "source name",
                  "target": "target name",
                  "feedback": "optional feedback"
                }
                // Additional edges...
              ]
            }
            \`\`\`  

            Ensure **strict adherence** to this format for a valid output.  

          `,
          stream: false,
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

  static sanitizeAIFeedback(input: string) {
    const jsonIndex = input.indexOf("json");
    return input.substring(jsonIndex + 4).replace(/`/g, "");
  }

  static async createFlowJSONFromAIFeedback(AIFeedback: string) {
    const feedbackObj = JSON.parse(this.sanitizeAIFeedback(AIFeedback)) as AIFeedback;

    const labelToIdMap: Record<string, string> = {}; // We need this to find source and target IDs for edges

    // Calculate Node Positions
    const nodeCount = feedbackObj.nodes?.length;
    const radius = 200;
    const centerX = 300;
    const centerY = 300;

    // Structure Nodes
    const nodes = feedbackObj.nodes.map((node: any, idx: number) => {
      const id = nanoid();
      const label = node.data.label;
      labelToIdMap[label] = id;
      const feedback = node.feedback;

      const angle = (idx / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      let type: string;
      if (iconNodes.has(label)) {
        type = label;
      } else {
        type = "circle"; //TODO: Add shape nodes
      }

      return {
        id,
        position: { x, y },
        type: "feedback",
        data: { label, feedback, type: "feedback" },
      };
    });

    // Structure Edges
    const edges = feedbackObj.edges?.map((edge) => {
      const sourceId = labelToIdMap[edge.source];
      const targetId = labelToIdMap[edge.target];

      if (!sourceId || !targetId) {
        throw new Error(
          `Could not find node ID for label: ${!sourceId ? edge.source : edge.target}`,
        );
      }

      const sourceHandle = `${sourceId}-right`;
      const targetHandle = `${targetId}-left`;

      const edgeId = `xy-edge__${sourceId}${sourceHandle}-${targetId}${targetHandle}`;

      return {
        id: edgeId,
        source: sourceId,
        sourceHandle,
        target: targetId,
        targetHandle,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: "arrow",
        },
        selected: false,
      };
    });

    // Return Flow JSON
    return {
      nodes,
      edges,
      viewport: {
        zoom: 0.5,
        x: 0,
        y: 0,
      },
    };
  }
}

export default FlowService;
