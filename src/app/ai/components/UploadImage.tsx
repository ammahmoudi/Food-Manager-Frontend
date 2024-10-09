import React, { useState, ChangeEvent } from "react";
import { Button, Image, Spinner, Card, CardFooter } from "@nextui-org/react";
import { toast } from "sonner";
 // API call function
import { TrashIcon } from "@heroicons/react/24/solid";
import { uploadImageToBackend } from "../services/aiApi";

interface ImageUploadProps {
  onImageIdReceived: (imageId: number) => void; // Callback prop to pass imageId to the parent component
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ onImageIdReceived }) => {
  const [image, setImage] = useState<string | null>(null); // To store image preview URL
  const [loading, setLoading] = useState<boolean>(false); // To show spinner during image upload
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false); // Simulated cropping modal state




  // Handle image change (upload)
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);

      // Simulate opening a crop modal
      setCropModalOpen(true);
      console.log("Selected file for cropping:", file);

      // For simplicity, directly upload the image after selecting (no actual cropping)
      await handleUploadToBackend(file);
      setLoading(false);
    }
  };

  // Handle the image upload to the backend and get the image ID
  const handleUploadToBackend = async (file: File) => {
    setLoading(true);
    try {
      const response = await uploadImageToBackend(file); // Make API call
      const imageId = response.id;
      onImageIdReceived(imageId); // Pass the received imageId to the parent component
      setImage(URL.createObjectURL(file)); // Show image preview
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
    setImage(null); // Clear the image preview
    toast.success("Image deleted successfully.");
  };

  return (
    <div className="">
      <Card
        isPressable
        onClick={() => document.getElementById("user-image-input")?.click()}
        className="w-full aspect-square bg-gray-200 relative"
      >
        {/* Image Preview and Deletion Button */}
        {image ? (
          <>
            <Image src={image} alt="Uploaded" className="w-full h-full object-cover" />
            <CardFooter className="absolute bottom-0 z-10">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage();
                    }}
                    radius="full"
                    size="sm"
                    className="w-full h-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-gray-500">Click to upload an image</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center w-full h-full bg-gray-100">
            <Spinner color="primary" size="lg" />
          </div>
        )}



        {/* Hidden File Input */}
        <input
          type="file"
          id="user-image-input"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Card>
    </div>
  );
};

export default ImageUploadComponent;




//  USAGE  //

{/*


const [imageId, setImageId] = useState<number | null>(null);

const handleImageIdReceived = (id: number) => {
    setImageId(id);
};

    <div className="p-4">
      <h1>Upload Image</h1>
      <ImageUpload onImageIdReceived={handleImageIdReceived} />
      {imageId && <p>Uploaded Image ID: {imageId}</p>}
    </div>



    */}