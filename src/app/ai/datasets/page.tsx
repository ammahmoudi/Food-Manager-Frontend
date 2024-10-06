"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import DatasetAlbum from "../components/DatasetAlbum"; // This is the ImageDisplayComponent
import { getUserDatasets } from "../services/aiApi"; // API function to fetch datasets
import Dataset from "../interfaces/Dataset";
import { toast } from "sonner";

const UserDatasetsPage = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch datasets for the user from the backend
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const fetchedDatasets = await getUserDatasets();
      setDatasets(fetchedDatasets);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      toast.error("Failed to load datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
<div className="container xl:w-1/2 mx-auto p-2 items-center">
      <h2 className="text-2xl font-semibold mb-4">Your Datasets</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : datasets.length > 0 ? (
        datasets.map((dataset) => (
          <div key={dataset.id} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
            <p className="text-sm mb-4">
              Created At: {new Date(dataset.created_at).toLocaleString()}
            </p>

            {/* DatasetAlbum Component to display images for this dataset */}
            <DatasetAlbum dataset={dataset} />
          </div>
        ))
      ) : (
        <p>No datasets available.</p>
      )}
    </div>
  );
};

export default UserDatasetsPage;
