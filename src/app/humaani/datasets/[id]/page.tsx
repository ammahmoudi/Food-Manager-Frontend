/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { Button, Link, Spinner } from "@nextui-org/react";
import { getDataset } from "../../services/aiApi";
import React from "react";
import { toast } from "sonner";
import DatasetAlbum from "../../components/DatasetAlbum"; // Import the DatasetAlbum component
import Dataset from "../../interfaces/Dataset";
import { useParams } from "next/navigation";



const ResultPage = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null); // Store dataset object
  const [loading, setLoading] = useState<boolean>(true);
  const { id: datasetId } = useParams(); // Get the dynamic dataset_id from the URL

  // Fetch dataset and start polling jobs
  const fetchDataset = async () => {
    if (!datasetId) return;


    try {
      setLoading(true);
      const fetchedDataset = await getDataset(datasetId as unknown as number);
      setDataset(fetchedDataset);
    } catch {
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
      {loading ? (
        <Spinner color="primary" size="lg" />
      ) : dataset ? (
        <>
          {/* Use the DatasetAlbum component to display images from the dataset */}
          <DatasetAlbum initialDataset={dataset} onUpdate={fetchDataset}  />

          {/* Request for Lora Button */}
          <div className="mt-6">
            <Button as={Link}
              href={`/humaani/lora/new?datasetId=${datasetId}`}
              color="primary"
              className="w-full"
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
