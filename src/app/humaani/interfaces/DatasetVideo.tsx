export interface DatasetVideo {
    id: number;
    name: string;
    video_file_url: string;
    cover_image_url: string | null;
    file_size: number | null;
    video_url: string | null;
    job_id: number | null;
    dataset_id: number | null;
    created_by: number;
    created_at: string;
}