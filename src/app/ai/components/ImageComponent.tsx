import React, { useEffect, useState } from "react";
import { Image, Card, CircularProgress } from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../interfaces/DatasetImage";
import DatasetImageInfoModal from "./modals/DatasetImageInfoModal";
import { getJob, getImageById } from "../services/aiApi";
import { Job } from "../interfaces/Job";

interface ImageProps {
  src_id: number;
  src_variant: "job" | "datasetImage";
  className?: string;
}

const ImageComponent: React.FC<ImageProps> = ({ src_id, src_variant, className }) => {
  const [image, setImage] = useState<DatasetImage | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const fallbackImage = "/images/ai/manani_fallback_square.png";

  // Poll the job based on the variant and src_id
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (src_variant === "job") {
          setIsPolling(true);
          const fetchedJob = await getJob(src_id);
          setJob(fetchedJob);

          // Poll every 5 seconds if the job status is not final (e.g., completed, failed)
          if (!["completed", "failed", "canceled"].includes(fetchedJob.status)) {
            intervalId = setInterval(async () => {
              const updatedJob = await getJob(src_id);
              setJob(updatedJob);

              // Stop polling when the job status becomes final
              if (["completed", "failed", "canceled"].includes(updatedJob.status)) {
                clearInterval(intervalId as NodeJS.Timeout);
                setIsPolling(false);
              }
            }, 1000);
          } else {
            setIsPolling(false);
          }
        } else if (src_variant === "datasetImage") {
          const fetchedImage = await getImageById(src_id);
          setImage(fetchedImage);
        }
      } catch (error) {
        console.error(`Error fetching data for ${src_variant} with ID ${src_id}:`, error);
        toast.error(`Failed to fetch ${src_variant} data.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Cleanup polling interval on component unmount
      }
    };
  }, [src_id, src_variant]);

  // Handle image deletion
  const handleDeleteImage = () => {
    setImage(null);
    setJob(null);
    toast.success("Image deleted successfully.");
  };

  const handleOpenInfoModal = (id: number) => {
    setSelectedImage(id);
    setIsInfoModalOpen(true);
  };

  // Find the first image from job result_data if job mode is active
  const getFirstJobImage = () => {
    if (job && job.result_data) {
      for (const nodeId of Object.keys(job.result_data)) {
        for (const inputName of Object.keys(job.result_data[nodeId])) {
          const output = job.result_data[nodeId][inputName];
          if (output.type === "image") {
            return output;
          }
        }
      }
    }
    return null;
  };

  const firstJobImage = src_variant === "job" ? getFirstJobImage() : null;

  // Unified Image Component for both modes with background handling
  const RenderImage = (props: { src: string | null; id: number | null }) => {
    const showBackgroundImage = (src_variant === "datasetImage") || (src_variant === "job" && job && job.status === "completed");

    if (loading || (src_variant === "job" && job && job.status === "running")) {
      return (
        <div className="flex flex-col items-center">
          <CircularProgress
            color="success"
            label={job?.status}
            size="lg"
            showValueLabel
            value={(job?.progress || 0) * 100}
          />
        </div>
      );
    }

    if (showBackgroundImage && props.src) {
      return (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              alt="Blurred Background"
              src={props.src || fallbackImage}
              className="w-full h-full object-cover rounded-none filter blur-sm"
              classNames={{ wrapper: "w-full h-full aspect-square" }}
            />
          </div>
          <Image
            src={props.src || fallbackImage}
            alt="Rendered Image"
            className="w-full h-full object-cover filter rounded-none"
            classNames={{ wrapper: "w-full h-full aspect-square" }}
            onClick={() => handleOpenInfoModal(props.id as number)}
            style={{ objectFit: "contain" }}
          />
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-gray-500">No Image Available</p>
      </div>
    );
  };

  return (
    <>
      {(image || firstJobImage) && (
        <Card 
        className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}
        >
          <RenderImage src={image ? image.image : firstJobImage?.value || null} id={firstJobImage?.id || null} />
        </Card>
      )}

      {/* Dataset Image Info Modal */}
      {selectedImage && (
        <DatasetImageInfoModal
          visible={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          imageId={selectedImage as number}
          onDeleteSuccess={handleDeleteImage}
        />
      )}
    </>
  );
};

export default ImageComponent;
