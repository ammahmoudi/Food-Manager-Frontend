import React, { useState, ChangeEvent, useEffect } from "react";
import { Button, Image, Spinner, Card, CardFooter } from "@nextui-org/react";
import { toast } from "sonner";
import { TrashIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { uploadTempImage } from "../services/aiApi";
import DatasetImage from "../interfaces/DatasetImage";
import DatasetImageInfoModal from "./modals/DatasetImageInfoModal";

interface ImageUploadProps {
  onImageIdReceived: (image: DatasetImage | null) => void;
  image?: DatasetImage | null;
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ onImageIdReceived, image: parentImage }) => {
  const [image, setImage] = useState<DatasetImage | null>(null); // To store image preview URL
  const [loading, setLoading] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Handle image change (upload)
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      await handleUploadToBackend(file);
      setLoading(false);
    }
  };

  // Update the image state when a new image is passed from the parent component
  useEffect(() => {
    if (parentImage) {
      setImage(parentImage);
    }
  }, [parentImage]);

  // Handle the image upload to the backend and get the image ID
  const handleUploadToBackend = async (file: File) => {
    setLoading(true);
    try {
      const uploadedImage: DatasetImage = await uploadTempImage(file);
      onImageIdReceived(uploadedImage);
      setImage(uploadedImage);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = () => {
    setImage(null);
    onImageIdReceived(null);
    toast.success("Image deleted successfully.");
  };

  return (
    <div className="relative w-full h-full">
      {loading ? (
        <Card className="flex flex-grow justify-center items-center w-full h-full bg-gray-100 aspect-square">
          <Spinner color="primary" size="lg" />
        </Card>
      ) : (
        <>
          {image && (
            <div className="absolute inset-0 z-0">
              <Image
                alt="User Image"
                className="w-full h-full object-cover blur-md"
                classNames={{ wrapper: "w-full h-full aspect-square " }}
                src={image?.image}
              />
            </div>
          )}

          <div className="relative z-10">
            <Card
              isPressable
              onClick={() => document.getElementById("user-image-input")?.click()}
              className={`w-full aspect-square bg-gray-200 relative items-center justify-center ${
                image ? "bg-transparent" : ""
              }`}
            >
              {image ? (
                <>
                  <Image
                    src={image.image}
                    alt="User Image"
                    className="w-full h-full object-cover"
                  />
                  <CardFooter className="absolute bottom-0 z-10 flex justify-between w-full p-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsInfoModalOpen(true);
                      }}
                      radius="full"
                      size="sm"
                      className="w-10 h-10 bg-blue-500 text-white shadow-lg"
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage();
                      }}
                      radius="full"
                      size="sm"
                      className="w-10 h-10 bg-red-500 text-white shadow-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <p className="text-gray-500">Click to upload an image</p>
                </div>
              )}

              <input
                type="file"
                id="user-image-input"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Card>
          </div>
        </>
      )}

      {image && (
        <DatasetImageInfoModal
          visible={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          imageId={image.id}
          onDeleteSuccess={handleDeleteImage}
        />
      )}
    </div>
  );
};

export default ImageUploadComponent;
