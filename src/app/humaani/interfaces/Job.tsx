export interface Job {
    id: number;
    workflow: number;
    status: string;
    runtime: string;
    image_outputs: ImageOutput[];
    video_outputs: VideoOutput[];
    text_outputs: string[];
    logs: string;
    user: number;
    dataset: number;
    progress: number;
}

interface ImageOutput {
    url: string;
    dataset_image_id: number;
}

interface VideoOutput {
    url: string;
    dataset_video_id: number;
    name: string;
    file_size: number;
    video_url: string;
    cover_image_url: string | null;
}