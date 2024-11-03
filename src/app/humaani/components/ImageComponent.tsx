import React, { useEffect, useRef, useState } from "react";
import { Image, Card, CircularProgress, Button, CardFooter } from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../interfaces/DatasetImage";
import DatasetImageInfoModal from "./modals/DatasetImageInfoModal";
import { getJob, getImageById } from "../services/aiApi";
import { Job } from "../interfaces/Job";
import { SlSizeFullscreen } from "react-icons/sl";
import { FaDownload } from "react-icons/fa";

interface ImageProps {
  src_id: number;
  src_variant: "job" | "datasetImage";
  className?: string;
}

const ImageComponent: React.FC<ImageProps> = ({ src_id, src_variant, className }) => {
  const [image, setImage] = useState<DatasetImage | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const imageRef = useRef(null);

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

  const handleDeleteImage = () => {
    setImage(null);
    setJob(null);
    toast.success("Image deleted successfully.");
  };

  const handleOpenInfoModal = (id: number) => {
    setSelectedImage(id);
    setIsInfoModalOpen(true);
  };

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

  const openFullscreen = () => {
    if (imageRef.current) {
      const imgElement = imageRef.current as any;
      if (imgElement.requestFullscreen) {
        imgElement.requestFullscreen();
      } else if (imgElement.webkitRequestFullscreen) {
        imgElement.webkitRequestFullscreen();
      } else if (imgElement.msRequestFullscreen) {
        imgElement.msRequestFullscreen();
      }
      setIsInfoModalOpen(false);
    }
  };

  const downloadImage = async () => {
    const imageUrl = image ? image.image : firstJobImage?.value || fallbackImage;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "downloaded_image.jpg";
      link.click();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image.");
    }
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
        <>
          <Card
            className={`w-full aspect-square bg-gray-200 relative items-center justify-center ${
              image ? "bg-transparent" : ""
            }`}
          >
            <div className="absolute inset-0 z-0">
              <Image
                alt="Blurred Background"
                src={props.src || fallbackImage}
                className="w-full h-full object-cover rounded-none filter blur-sm"
                classNames={{ wrapper: "w-full h-full aspect-square" }}
              />
            </div>
            <Image
              ref={imageRef}
              src={props.src || fallbackImage}
              alt="Rendered Image"
              className="w-full h-full object-cover filter rounded-none"
              classNames={{ wrapper: "w-full h-full aspect-square" }}
              onClick={() => handleOpenInfoModal(props.id as number)}
              style={{ objectFit: "contain" }}
            />

            <CardFooter className="absolute bottom-0 z-10 flex justify-between w-full p-2">
              <Button
                radius="full"
                size="sm"
                className="bg-blue-500 text-white shadow-lg"
                onPress={openFullscreen}
              >
                <SlSizeFullscreen />
              </Button>

              <Button
                radius="full"
                size="sm"
                className="bg-lime-300 text-white shadow-lg"
                onPress={downloadImage}
              >
                <FaDownload />
              </Button>
            </CardFooter>
          </Card>
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
      {image && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <RenderImage src={image.image} id={image.id} />
        </Card>
      )}
      {firstJobImage && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square bg-null ${className}`}>
          <RenderImage src={firstJobImage.value} id={firstJobImage.id} />
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
              classNames={{ wrapper: "w-full h-full aspect-square" }}
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
              classNames={{ wrapper: "w-full h-full aspect-square" }}
            />
          </div>
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
