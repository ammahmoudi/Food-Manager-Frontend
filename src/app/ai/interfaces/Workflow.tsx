export interface Workflow {
  id: number;
  name: string;
  json_data: Record<string, unknown>; // This can accommodate any valid JSON structure
  last_modified: string;
  inputs: Record<
    string, // Node ID
    {
      name: string; // Node Name
      inputs: Record<string, string>; // Inputs with types
    }
  >;
  outputs: Record<
  string, // Node ID
  {
    name: string; // Node Name
    outputs: Record<string, string>; // Inputs with types
  }
>;
  user: number;
}
