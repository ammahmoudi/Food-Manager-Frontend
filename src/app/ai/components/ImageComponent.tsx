import React, { useEffect, useState } from "react";
import { Image, Card, Spinner } from "@nextui-org/react";
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
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "/images/ai/manani_fallback_square.png";

  // Poll the image or job based on the variant and src_id
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (src_variant === "job") {
          const fetchedJob = await getJob(src_id);
          setJob(fetchedJob);
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
  }, [src_id, src_variant]);

  // Handle image deletion
  const handleDeleteImage = () => {
    setImage(null);
    setJob(null)
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

  // Unified Image Component for both modes with fallback handling
  const RenderImage = (props: { src: string | null; id: number }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(props.src);

    const handleImageError = () => {
      setImageSrc(fallbackImage);
      setImageError(true);
    };

    return (
      <Image
        src={imageSrc || fallbackImage}
        alt="Rendered Image"
        className="w-full h-full object-contain rounded-none"
        classNames={{ wrapper: "w-full h-full aspect-square" }}
        onClick={() => handleOpenInfoModal(props.id)}
        style={{ objectFit: "contain" }}
        onError={handleImageError}
      />
    );
  };

  return (
    <>
      {(image || firstJobImage) && (
        <Card className={`relative flex flex-col items-center justify-center w-full aspect-square ${className}`}>
          {/* Blurred Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              alt="Blurred Background"
              src={image ? image.image : firstJobImage?.value || fallbackImage}
              className="w-full h-full object-cover rounded-none filter blur-sm"

              classNames={{ wrapper: "w-full h-full aspect-square" }}
              onError={() => (imageError ? (e: { currentTarget: { src: string; }; }) => (e.currentTarget.src = fallbackImage) : undefined)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center w-full h-full z-10">
              <Spinner color="primary" size="lg" />
            </div>
          ) : image ? (
            <RenderImage src={image.image} id={image.id} />
          ) : firstJobImage ? (
            <RenderImage src={firstJobImage.value} id={firstJobImage.id} />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full z-10">
              <p className="text-gray-500">No Image Available</p>
            </div>
          )}
        </Card>
      )}

      {/* Dataset Image Info Modal */}
      {selectedImage && (
        <DatasetImageInfoModal
          visible={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          imageId={selectedImage}
          onDeleteSuccess={handleDeleteImage}
        />
      )}
    </>
  );
};

export default ImageComponent;
