import React, { useEffect,  useState } from "react";
import { Image, Card, CircularProgress, useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../interfaces/DatasetImage";
import { getJob, getImageById } from "../services/aiApi";
import { Job } from "../interfaces/Job";
import FullScreenModal from "./modals/FullScreenModal";

interface ImageProps {
  src_id: number;
  src_variant: "job" | "datasetImage";
  className?: string;
  isClickable?: boolean
  onChange?:() => void
}

const ImageComponent: React.FC<ImageProps> = ({ src_id, src_variant, className , isClickable=true , onChange}) => {
  const [image, setImage] = useState<DatasetImage | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
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

          if (!["completed", "failed", "canceled"].includes(fetchedJob.status)) {
            intervalId = setInterval(async () => {
              const updatedJob = await getJob(src_id);
              setJob(updatedJob);

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

  const getFirstJobImage = () => {
    if (job && job.image_outputs && job.image_outputs.length > 0) {
      return job.image_outputs[0];
    }
    return null;
  };

  const firstJobImage = src_variant === "job" ? getFirstJobImage() : null;

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
        <Card
          className={`w-full aspect-square bg-gray-200 relative items-center justify-center ${image ? "bg-transparent" : ""}`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              alt="Blurred Background"
              src={props.src || fallbackImage}
              className="w-full h-full object-cover rounded-none filter blur-sm"
            />
          </div>
          <Image

            src={props.src || fallbackImage}
            alt="Rendered Image"
            className="w-full h-full object-cover filter rounded-none"
            onClick={() => isClickable && handleOpenFullScreenModal(props.id as number)}
            style={{ objectFit: "contain" }}
          />
        </Card>
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
      {image && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <RenderImage src={image.image} id={image.id} />
        </Card>
      )}
      {firstJobImage && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <RenderImage src={firstJobImage.url} id={firstJobImage.dataset_image_id} />
        </Card>
      )}
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
        <FullScreenModal initialImageId={selectedImage} isOpen={isFullScreenModalOpen} onClose={closeFullScreenModal} onUpdate={()=> onChange}/>
      )}
    </>
  );
};

export default ImageComponent;
