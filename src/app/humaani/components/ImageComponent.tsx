import React, { useEffect, useState } from "react";
import { Image, Card, CircularProgress, useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../interfaces/DatasetImage";
import { getJob, getImageById } from "../services/aiApi";
import { Job } from "../interfaces/Job";
import FullScreenModal from "./modals/FullScreenModal";
import { HiPlay } from "react-icons/hi";

interface ImageProps {
  src_id: number;
  src_variant: "job" | "datasetImage";
  className?: string;
  isClickable?: boolean;
  onChange?: () => void;
}

const ImageComponent: React.FC<ImageProps> = ({
  src_id,
  src_variant,
  className,
  isClickable = true,
  onChange,
}) => {
  const [image, setImage] = useState<DatasetImage | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { isOpen: isFullScreenModalOpen, onOpen: openFullScreenModal, onClose: closeFullScreenModal } = useDisclosure();

  const fallbackImage = "/images/ai/manani_fallback_square.png";

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (src_variant === "job") {
          const fetchedJob = await getJob(src_id);
          setJob(fetchedJob);

          // Set cover image to video cover if available, otherwise first image output
          if (fetchedJob.video_outputs && fetchedJob.video_outputs.length > 0) {
            setCoverImage(fetchedJob.video_outputs[0].cover_image_url || fallbackImage);
          } else if (fetchedJob.image_outputs && fetchedJob.image_outputs.length > 0) {
            setCoverImage(fetchedJob.image_outputs[0].url);
          }

          // Poll if the job is running or pending
          if (!["completed", "failed", "canceled"].includes(fetchedJob.status)) {
            intervalId = setInterval(async () => {
              const updatedJob = await getJob(src_id);
              setJob(updatedJob);
              // Set cover image to video cover if available, otherwise first image output
          if (fetchedJob.video_outputs && fetchedJob.video_outputs.length > 0) {
            setCoverImage(fetchedJob.video_outputs[0].cover_image_url || fallbackImage);
          } else if (fetchedJob.image_outputs && fetchedJob.image_outputs.length > 0) {
            setCoverImage(fetchedJob.image_outputs[0].url);
          }

              if (["completed", "failed", "canceled"].includes(updatedJob.status)) {
                clearInterval(intervalId as NodeJS.Timeout);
              }
            }, 1000);
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
        clearInterval(intervalId);
      }
    };
  }, [src_id, src_variant]);

  const handleOpenFullScreenModal = (id: number) => {
    setSelectedImage(id);
    openFullScreenModal();
  };

  const RenderImage = (props: { src: string | null; id: number | null }) => {
    if (src_variant === "job" && job && (job.status === "running" || job.status === "pending")) {
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

    if (props.src && !loading) {
      return (
        <Card className={`relative w-full aspect-square bg-gray-200 ${image ? "bg-transparent" : ""}`}>
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
            className="object-cover w-full h-full rounded-none"
            classNames={{ wrapper: "w-full h-full aspect-square" }}
            onClick={() => isClickable && handleOpenFullScreenModal(props.id as number)}
            style={{ objectFit: "contain" }}
          />
          {/* Show larger play icon overlay if the job has a video */}
          {job?.video_outputs && job.video_outputs.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <HiPlay className="text-white text-6xl opacity-80" />
            </div>
          )}
        </Card>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-gray-500">No Image Available</p>
      </div>
    );
  };

  const firstJobImage = src_variant === "job" ? (job?.image_outputs?.[0] || null) : null;

  return (
    <>
      {/* Render the image component for dataset images */}
      {image && (
        <Card className={`relative w-full aspect-square ${className}`}>
          <RenderImage src={image.image} id={image.id} />
        </Card>
      )}
      {/* Render the cover image (from video) or first job image */}
      {(firstJobImage || coverImage) && (
        <Card className={`relative w-full aspect-square ${className}`}>
          <RenderImage src={coverImage || firstJobImage?.url || fallbackImage} id={firstJobImage?.dataset_image_id || src_id} />
        </Card>
      )}
      {/* Loading for running/pending jobs */}
      {!firstJobImage && src_variant === "job" && (job?.status === "running" || job?.status === "pending") && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <div className="flex flex-col items-center">
            <CircularProgress
              color="success"
              label={job?.status}
              size="lg"
              showValueLabel
              value={(job?.progress || 0) * 100}
            />
          </div>
        </Card>
      )}
      {/* Failed/canceled status fallback */}
      {!firstJobImage && src_variant === "job" && (job?.status === "failed" || job?.status === "canceled") && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <div className="absolute inset-0 z-0">
            <Image
              alt="Blurred Background"
              src={fallbackImage}
              className="w-full h-full object-cover rounded-none"
            />
            <div className="absolute flex flex-row justify-center inset-1 z-10">
              <p className="uppercase">{job.status}</p>
            </div>
          </div>
        </Card>
      )}
      {/* No dataset image available */}
      {!image && src_variant === "datasetImage" && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <div className="absolute inset-0 z-0">
            <Image
              alt="Blurred Background"
              src={fallbackImage}
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </Card>
      )}

      {selectedImage && (
        <FullScreenModal initialImageId={selectedImage} isOpen={isFullScreenModalOpen} onClose={closeFullScreenModal} onUpdate={() => onChange} />
      )}
    </>
  );
};

export default ImageComponent;
