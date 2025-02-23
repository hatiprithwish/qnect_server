export type Feedback = {
  requiredNodes: string[];
  goodNodes: string[];
  faultyEdges: string[];
  missingEdges: string[];
};

export type AIFeedback = {
  nodes: {
    data: {
      label: string;
      feedback?: string;
    };
  }[];
  edges: {
    source: string;
    target: string;
    feedback?: string;
  }[];
};
