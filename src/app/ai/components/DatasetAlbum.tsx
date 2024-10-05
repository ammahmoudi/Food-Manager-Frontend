import React from "react";
import { Image, Spinner } from "@nextui-org/react";
import Dataset from "../interfaces/Dataset";

interface DatasetImagesProps {
  dataset: Dataset;
  loading: boolean;
  error?: string;
}

const DatasetImages: React.FC<DatasetImagesProps> = ({ dataset, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!dataset.images || dataset.images.length === 0) {
    return <p>No images available for this dataset.</p>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {dataset.images.map((imageURL, index) => (
        <div key={index} className="w-40 h-40">
          <Image
            src={imageURL}
            alt={`Dataset ${dataset.name} Image ${index + 1}`}
            className="w-full h-full object-cover border rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default DatasetImages;
