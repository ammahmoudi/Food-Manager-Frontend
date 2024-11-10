interface DatasetVideo {
    id: number;
    name: string; // Combined name and file name of the video
    video_file_url: string; // Full URL to the local video file
    cover_image_url: string | null; // Full URL to the cover image, or null if not present
    file_size: number | null; // Size of the video file in bytes
    video_url: string | null; // External URL from the API
    job_id: number | null; // ID of the related Job, if any
    dataset_id: number | null; // ID of the related Dataset, if any
    created_by: number; // User ID who created the video
    created_at: string; // Timestamp for when the video was created
}