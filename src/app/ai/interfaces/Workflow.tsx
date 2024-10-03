export interface Workflow {
    id: number;
    name: string;
    json_data: Record<string, unknown>; // This can accommodate any valid JSON structure
    last_modified: string;
    inputs: Record<string, Record<string, string>>; // Keeps the current structure for inputs
    user: number;
  }