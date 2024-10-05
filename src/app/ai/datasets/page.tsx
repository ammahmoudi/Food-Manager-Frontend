"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { getDatasets } from "../../services/aiApi"; // Make sure this service fetches the datasets
import { toast } from "sonner";

// Define the Dataset interface (same as the one in DatasetImages)
interface Dataset {
  id: number;
  name: string;
  created_by: number;
  created_at: string;
  character: number | null;
  jobs?: number[];
  images?: string[]; // Assuming these are URLs
  dataset_type: string;
}

const DatasetListPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of datasets on component mount
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const fetchedDatasets = await getDatasets(); // Fetch datasets from the backend
      setDatasets(fetchedDatasets);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      setError("Error fetching datasets.");
      toast.error("Error fetching datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">All Datasets</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner color="primary" size="lg" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : datasets.length === 0 ? (
        <p>No datasets available.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="border p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
              <DatasetImages dataset={dataset} loading={false} />
              {/* Optional: Add more dataset info below if needed */}
              <p className="text-sm mt-2">Created by: {dataset.created_by}</p>
              <p className="text-sm">Created at: {new Date(dataset.created_at).toLocaleString()}</p>
              <p className="text-sm">Dataset type: {dataset.dataset_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatasetListPage;
