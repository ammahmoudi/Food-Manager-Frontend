export interface Job {
    id: number;
    workflow: number;
    status: 'pending' | 'completed' | 'failed'|'running'; // Define more statuses if needed
    runtime: string;
    images: number[];
    result_data: {
      image_urls: string[];
      texts: string[]
    };
    input_data: Record<string, Record<string, string>>; // Adjust this based on your input data structure
    logs: string;
    user: number;
    dataset: number;
}