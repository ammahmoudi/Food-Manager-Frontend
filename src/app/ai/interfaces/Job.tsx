export interface Job {
  id: number;
  workflow: number;
  status: 'pending' | 'completed' | 'failed' | 'running'; // Define more statuses if needed
  runtime: string;
  images: number[];
  result_data: {
      [node_id: string]: {
          [input_name: string]: {
              id: string;  // The unique ID for the output (e.g., for images)
              type: string; // The type of the output (e.g., "image", "text_prompt_complex")
              value: string; // The value, either the text content or the full image URL
          };
      };
  };
  input_data: Record<string, Record<string, string>>; // Adjust this based on your input data structure
  logs: string; // Will include additional JSON formatted logs with extra images/texts and duration
  user: number;
  dataset: number;
}
