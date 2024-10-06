"use client";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { getDataset } from "../../services/aiApi";
import React from "react";
import { toast } from "sonner";
import DatasetAlbum from "../../components/DatasetAlbum"; // Import the DatasetAlbum component
import Dataset from "../../interfaces/Dataset";

const ResultPage = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null); // Store dataset object
  const [loading, setLoading] = useState<boolean>(true);
  const [polling, setPolling] = useState<boolean>(true);

  const { id: datasetId } = useParams(); // Get the dynamic dataset_id from the URL

  // Fetch dataset and start polling jobs
  const fetchDataset = async () => {
    if (!datasetId) return;

    try {
      setLoading(true);
      const fetchedDataset = await getDataset(datasetId as unknown as number);
      setDataset(fetchedDataset);
    } catch (error) {
      console.error("Error fetching dataset:", error);
      toast.error("Failed to load dataset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, [datasetId]);

  return (
<div className="container xl:w-1/2 mx-auto p-2 items-center">
      <h2 className="text-2xl font-semibold mb-4">Dataset Images</h2>
      {loading ? (
        <Spinner color="primary" size="lg" />
      ) : dataset ? (
        <>
          {/* Use the DatasetAlbum component to display images from the dataset */}
          <DatasetAlbum dataset={dataset} />

          {/* Request for Lora Button */}
          <div className="mt-6">
            <Button
              color="primary"
              className="w-full"
              isDisabled={polling} // Disable if polling is still active
              onClick={() => toast.success("Lora requested!")}
            >
              Request for Lora
            </Button>
          </div>
        </>
      ) : (
        <p>No dataset found.</p>
      )}
    </div>
  );
};

export default ResultPage;
