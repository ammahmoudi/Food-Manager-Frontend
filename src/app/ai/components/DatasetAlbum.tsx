import React, { useEffect} from "react";
import { toast } from "sonner";
import Dataset from "../interfaces/Dataset";
import ImageComponent from "./ImageComponent";

interface DatasetAlbumProps {
  dataset: Dataset; // Single dataset passed as a prop
}

const DatasetAlbum: React.FC<DatasetAlbumProps> = ({ dataset }) => {

  useEffect(() => {
    if (!dataset || (!dataset.images?.length && !dataset.jobs?.length)) {
      toast.error("No images or jobs available in this dataset.");
    }
  }, [dataset]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold mb-2">{dataset.name}</h3>
      <div className="flex flex-wrap gap-4">
        {dataset.images && dataset.images.length > 0 ? (
          // Displaying dataset images
          dataset.images.map((imageId) => (
            <div key={imageId} className="w-40 h-40">
              <ImageComponent src_id={imageId} src_variant="datasetImage" />
            </div>
          ))
        ) : dataset.jobs && dataset.jobs.length > 0 ? (
          // Displaying job images
          dataset.jobs.map((jobId) => (
            <div key={jobId} className="w-40 h-40">
              <ImageComponent src_id={jobId} src_variant="job" />
            </div>
          ))
        ) : (
          <p>No images or jobs available in this dataset.</p>
        )}
      </div>
    </div>
  );
};

export default DatasetAlbum;
