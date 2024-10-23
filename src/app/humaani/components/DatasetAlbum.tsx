import React from "react";
import Dataset from "../interfaces/Dataset";
import ImageComponent from "./ImageComponent";

interface DatasetAlbumProps {
  dataset: Dataset;
}

const DatasetAlbum: React.FC<DatasetAlbumProps> = ({ dataset }) => {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 transparent">
        {dataset.images && dataset.images.length > 0 ? (
          dataset.images.map((imageId) => (
            <div key={imageId} className="w-40 h-40">
              <ImageComponent src_id={imageId} src_variant="datasetImage" />
            </div>
          ))
        ) : dataset.jobs && dataset.jobs.length > 0 ? (
          dataset.jobs.map((jobId) => (
            <ImageComponent className="w-40 h-40" key={jobId} src_id={jobId} src_variant="job"  />
          ))
        ) : (
          <p>No images or jobs available in this dataset.</p>
        )}
      </div>
    </div>
  );
};

export default DatasetAlbum;
