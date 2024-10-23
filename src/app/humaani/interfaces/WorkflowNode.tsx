export interface WorkflowNode {
    id: string;
    name: string;
    type: string;
    inputs: string[]; // List of input names
    outputs: string[]; // List of input names

  }
  