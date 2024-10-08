import { useEffect, useState } from "react";
import { Image, Spinner, Skeleton } from "@nextui-org/react";
import { toast } from "sonner";
import { getImageById, getJob } from "../services/aiApi";
import Dataset from "../interfaces/Dataset";
import { Job } from "../interfaces/Job";
import DatasetImage from "../interfaces/DatasetImage";

interface DatasetAlbumProps {
  dataset: Dataset;
}

const DatasetAlbum: React.FC<DatasetAlbumProps> = ({ dataset }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [images, setImages] = useState<string[]>([]); // For storing image URLs
  const [loading, setLoading] = useState<boolean>(true);

  // Function to poll a specific job's status until it's complete or fails
  const pollJobStatus = async (jobId: number) => {
    // Fetch job status immediately
    const fetchJobStatus = async () => {
      try {
        const jobData = await getJob(jobId);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, ...jobData } : job
          )
        );

        if (jobData.status === "completed") {
          // Extract image URLs from the new result_data structure
          const imageUrls: string[] = [];
          if (jobData.result_data) {
            Object.keys(jobData.result_data).forEach((nodeId) => {
              const nodeOutputs = jobData.result_data[nodeId];
              Object.keys(nodeOutputs).forEach((inputName) => {
                const output = nodeOutputs[inputName];
                if (output.type === "image") {
                  imageUrls.push(output.value); // Add full image URLs to the array
                }
              });
            });
          }

          setImages((prevImages) => [...prevImages, ...imageUrls]);
          return true; // Job completed
        } else if (jobData.status === "failed") {
          return true; // Job failed
        }
        return false; // Job still pending/running
      } catch (error) {
        toast.error(`Error fetching job status for job ${jobId}: ${error}`);
        return true; // Stop polling on error
      }
    };

    // First call immediately
    const jobCompleted = await fetchJobStatus();
    
    // If the job is not completed, start polling every 5 seconds
    if (!jobCompleted) {
      const intervalId = setInterval(async () => {
        const jobCompleted = await fetchJobStatus();
        if (jobCompleted) {
          clearInterval(intervalId); // Stop polling when the job is done
        }
      }, 5000); // Poll every 5 seconds
    }
  };

  // Function to fetch job data and images by job IDs
  const fetchJobImages = async (jobIds: number[]) => {
    try {
      const initialJobs = jobIds.map((jobId) => ({
        id: jobId,
        status: "pending", // Initial status
        result_data: {},
      }));
      setJobs(initialJobs);

      // Start polling each job independently
      jobIds.forEach((jobId) => {
        pollJobStatus(jobId); // Poll each job
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job images.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch images by image IDs (if dataset has images)
  const fetchImageByIds = async (imageIds: number[]) => {
    try {
      const imagePromises = imageIds.map(async (imageId) => {
        const imageData: DatasetImage = await getImageById(imageId);
        return imageData.images;
      });
      const fetchedImages = await Promise.all(imagePromises);
      setImages((prevImages) => [...prevImages, ...fetchedImages]);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images.");
    } finally {
      setLoading(false);
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
              images.map((imageUrl, index) => (
                <div key={index} className="w-40 h-40">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover border rounded-md"
                  />
                </div>
              ))
            ) : (
              <div className="w-40 h-40 relative">
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
      ) : images.length > 0 ? (
        images.map((imageUrl, index) => (
          <div key={index} className="w-40 h-40">
            <Image
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover border rounded-md"
            />
          </div>
        ))
      ) : (
        <p>No jobs or images available.</p>
      )}
    </div>
  );
};

export default DatasetAlbum;
