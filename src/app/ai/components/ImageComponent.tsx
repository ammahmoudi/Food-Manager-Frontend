import React, { useEffect, useState } from "react";
import { Image, Card, Spinner } from "@nextui-org/react";
import { toast } from "sonner";
import DatasetImage from "../interfaces/DatasetImage";
import DatasetImageInfoModal from "./modals/DatasetImageInfoModal";
import { getJob, getImageById } from "../services/aiApi"; // Assuming these methods are implemented
import { Job } from "../interfaces/Job";

interface ImageProps {
  src_id: number;
  src_variant: "job" | "datasetImage";
}

const ImageComponent: React.FC<ImageProps> = ({ src_id, src_variant }) => {
  const [image, setImage] = useState<DatasetImage | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedImage,setSelectedImage]= useState<number|null>(null);

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
        toast.success("Data fetched successfully!");
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
    toast.success("Image deleted successfully.");
  };

  const handleOpenInfoModal = (id: number) => {
    setSelectedImage(id)
    setIsInfoModalOpen(true)
  }

  return (
    <div className="relative w-full h-full">
      {/* Blurred Image in the background */}

      {image && (<>
          <div className="absolute inset-0 z-0">
            <Image
              alt="Background Image"
              className="w-full h-full object-cover blur-md"
              classNames={{ wrapper: "w-full h-full aspect-square" }}
              src={image.image}
            />
          </div>


        <div className="relative z-10">
          <Card
            isPressable
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`w-full aspect-square bg-gray-200 relative items-center justify-center ${
              image ? "bg-transparent" : ""
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center w-full h-full">
                <Spinner color="primary" size="lg" />
              </div>
            ) : image ? (
              <Image src={image.image} alt="Uploaded Image"
                onClick={()=>handleOpenInfoModal(image.id)}
                className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </Card>
        </div>
      </>)}

      {/* Handle multiple images in a job */}

      {job && job.result_data && (
  <Card className="flex flex-col items-center justify-center w-full h-full">
    <div className="flex flex-row">
      {Object.keys(job.result_data).map((nodeId) =>
        Object.keys(job.result_data[nodeId]).map((inputName) => {
          const output = job.result_data[nodeId][inputName];

          return output.type === "image" ? (
            <div key={output.id} >
              <Image
                src={output.value}
                alt="Job Image"
                className="w-full h-auto object-cover"
                onClick={() => handleOpenInfoModal(parseInt(output.id))}
              />
            </div>
          ) : null;
        })
      )}
    </div>
  </Card>
)}



      {/* Dataset Image Info Modal */}
      {selectedImage && (
        <DatasetImageInfoModal
          visible={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          imageId={selectedImage }
          onDeleteSuccess={handleDeleteImage}
        />
      )}
    </div>
  );
};

export default ImageComponent;
