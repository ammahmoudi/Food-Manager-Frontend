import { useEffect, useState } from "react";
import { Image, Spinner, Skeleton } from "@nextui-org/react";
import { toast } from "sonner";
import { getImageById, getJob } from "../services/aiApi";
import Dataset from "../interfaces/Dataset";
import { Job } from "../interfaces/Job";


interface ImageDisplayComponentProps {
  dataset: Dataset;
}

const ImageDisplayComponent: React.FC<ImageDisplayComponentProps> = ({ dataset }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [images, setImages] = useState<string[]>([]); // For storing image URLs
  const [loading, setLoading] = useState<boolean>(true);
  const [polling, setPolling] = useState<boolean>(true);

  // Function to fetch job data and images by job IDs
  const fetchJobImages = async (jobIds: number[]) => {
    try {
      const initialJobs = jobIds.map((jobId) => ({
        id: jobId,
        status: "pending", // Initial status
        result_data: {
          image_urls: [], // Empty array for images
        },
      }));
      setJobs(initialJobs);

      const intervalId = setInterval(async () => {
        const updatedJobs = await Promise.all(
          initialJobs.map(async (job: Job) => {
            const jobData: Job = await getJob(job.id);
            return jobData;
          })
        );

        setJobs(updatedJobs);

        // If all jobs are completed or failed, stop polling
        if (
          updatedJobs.every(
            (job) => job.status === "completed" || job.status === "failed"
          )
        ) {
          clearInterval(intervalId);
          setPolling(false);
        }

        // Collect image URLs from completed jobs
        const completedImages = updatedJobs
          .filter((job) => job.status === "completed")
          .flatMap((job) => job.result_data.image_urls);
        setImages(completedImages);
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job images.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch images by image IDs (if any)
  const fetchImageByIds = async (imageIds: number[]) => {
    try {
      const imagePromises = imageIds.map(async (imageId) => {
        const imageData: ImageData = await getImageById(imageId);
        return imageData.image;
      });
      const fetchedImages = await Promise.all(imagePromises);
      setImages((prevImages) => [...prevImages, ...fetchedImages]);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images.");
    }
  };

  // Fetch jobs or images based on the dataset
  const fetchImages = async () => {
    setLoading(true);
    if (dataset.jobs && dataset.jobs.length > 0) {
      await fetchJobImages(dataset.jobs);
    } else if (dataset.images && dataset.images.length > 0) {
      await fetchImageByIds(dataset.images);
    } else {
      setLoading(false);
      toast.error("No images or jobs found in the dataset.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, [dataset]);

  return (
    <div className="flex flex-wrap gap-4">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <Spinner color="primary" size="lg" />
        </div>
      ) : jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="flex flex-col items-center">
            {job.status === "completed" ? (
              job.result_data.image_urls.map((imageUrl, index) => (
                <div key={index} className="w-40 h-40">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover border rounded-md"
                  />
                </div>
              ))
            ) : (
              <div className="w-40 h-40">
                <Skeleton width="100%" height="100%" />
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                  <Spinner color="primary" />
                </div>
              </div>
            )}
            <p className="mt-2 text-sm">Job ID: {job.id}</p>
            <p className="text-sm">Status: {job.status}</p>
          </div>
        ))
      ) : (
        <p>No jobs or images available.</p>
      )}
    </div>
  );
};

export default ImageDisplayComponent;
