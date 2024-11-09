export interface Job {
    id: number;
    workflow: number;
    status: 'pending' | 'completed' | 'failed' | 'running' | 'canceled';
    runtime: string;
    image_outputs: {
        url: string;
        dataset_image_id: number;
    }[];
    video_outputs: string[];
    text_outputs: string[];
    input_data: Record<string, Record<string, string>>;
    logs: string;
    user: number;
    user_details: {
        id: number;
        full_name: string;
        user_image: string;
        role: string;
    };
    dataset: number;
    progress: number;
    variants: number[];
}