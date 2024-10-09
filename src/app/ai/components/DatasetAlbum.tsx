/* eslint-disable react-hooks/exhaustive-deps */
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
  const [images, setImages] = useState<string[]>([]); // For storing image URLs from image-type datasets
  const [loading, setLoading] = useState<boolean>(true);

  // Function to poll a specific job's status until it's complete or fails
  const pollJobStatus = async (jobId: number) => {
    const fetchJobStatus = async () => {
      try {
        const jobData = await getJob(jobId);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, ...jobData } : job
          )
        );
        return jobData.status === "completed" || jobData.status === "failed";
      } catch (error) {
        toast.error(`Error fetching job status for job ${jobId}: ${error}`);
        return true; // Stop polling on error
      }
    };

    const jobCompleted = await fetchJobStatus();
    if (!jobCompleted) {
      const intervalId = setInterval(async () => {
        const jobCompleted = await fetchJobStatus();
        if (jobCompleted) clearInterval(intervalId); // Stop polling when the job is done
      }, 5000);
    }
  };

  // Function to fetch job data and handle images in result_data for each job
  const fetchJobImages = async (jobIds: number[]) => {
    try {
      const initialJobs: Job[] = jobIds.map((jobId) => ({
        id: jobId,
        status: "pending",
        result_data: {}, // Initialize empty result_data
        images: [],
        workflow: 0, // Use the appropriate default value or fetch as needed
        runtime: "", // Initialize runtime as an empty string to match the `Job` interface
        input_data: {}, // Initialize as empty object
        logs: "",
        user: 0, // Or assign the appropriate user id or placeholder
        dataset: 0, // Use the correct dataset id or default
      }));
      setJobs(initialJobs);

      jobIds.forEach((jobId) => pollJobStatus(jobId)); // Poll each job
    } catch (error) {
      console.error("Failed to load job images:", error);
      toast.error("Failed to load job images.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch images by image IDs for datasets with image types
  const fetchImageByIds = async (imageIds: number[]) => {
    try {
      const imagePromises = imageIds.map(async (imageId) => {
        const imageData: DatasetImage = await getImageById(imageId);
        return imageData.image; // Assuming `image` is the field with the full URL
      });
      const fetchedImages = await Promise.all(imagePromises);
      setImages(fetchedImages); // Replace previous images
    } catch (error) {
      console.error("Failed to load images:", error);
      toast.error("Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  // Main function to determine whether dataset contains jobs or images and fetch accordingly
  const fetchImages = async () => {
    setLoading(true);

    if (dataset && dataset.jobs && dataset.jobs.length > 0) {
      // Dataset contains jobs, fetch job images
      await fetchJobImages(dataset.jobs);
    } else if (dataset && dataset.images && dataset.images.length > 0) {
      // Dataset contains images, fetch them by their IDs
      await fetchImageByIds(dataset.images);
    } else {
      toast.error("No images or jobs found in the dataset.");
      setLoading(false);
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
      ) : images.length > 0 ? (
        // If the dataset has image type, display the fetched images
        images.map((imageUrl, index) => (
          <div key={index} className="w-40 h-40">
            <Image
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover border rounded-md"
            />
          </div>
        ))
      ) : jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="flex flex-col items-center">
            {job.status === "completed" ? (
              // Map over result_data to extract and render images for each job
              Object.keys(job.result_data).map((nodeId) => (
                Object.keys(job.result_data[nodeId]).map((inputName) => {
                  const output = job.result_data[nodeId][inputName];
                  return output.type === "image" ? (
                    <div key={output.id} className="w-40 h-40">
                      <Image
                        src={output.value} // Use the full URL for the image
                        alt={`Image for Node ${nodeId} - ${inputName}`}
                        className="w-full h-full object-cover border rounded-md"
                      />
                      {/* Display prompts if available */}
                      {/* <p className="mt-2 text-xs">
                        Negative Prompt: {job.result_data[nodeId]?.negative_prompt || "N/A"}
                      </p>
                      <p className="text-xs">
                        Complex Prompt: {job.result_data[nodeId]?.complex_prompt || "N/A"}
                      </p>
                      <p className="text-xs">
                        Tag Prompt: {job.result_data[nodeId]?.tag_prompt || "N/A"}
                      </p> */}
                    </div>
                  ) : null;
                })
              ))
            ) : (
              <div className="w-40 h-40 relative">
                <Skeleton />
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

export default DatasetAlbum;
