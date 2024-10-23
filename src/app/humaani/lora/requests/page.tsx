"use client";

import React, { useEffect, useState } from "react";
import { Spinner, Card } from "@nextui-org/react";
import { toast } from "sonner";
import { LoraRequest } from "../../interfaces/LoraRequest";
import { getLoraRequests } from "../../services/aiApi";
import LoraRequestCard from "../../components/LoraRequestCard";

const LoraRequestsPage: React.FC = () => {
  const [loraRequests, setLoraRequests] = useState<LoraRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all Lora Requests
  const fetchLoraRequests = async () => {
    try {
      setLoading(true);
      const requests = await getLoraRequests();
      setLoraRequests(requests);
    } catch (error) {
      toast.error("Failed to load LoRA requests.");
      console.error("Error fetching LoRA requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch LoRA requests on page load
  useEffect(() => {
    fetchLoraRequests();
  }, []);

  // Handle status change for a specific request
  const updateLoraRequests = () => {
    setLoraRequests((prevRequests) =>
      prevRequests.map((request) => ({
        ...request,
        status: "accepted", // status must be a valid string from the union type
      }))
    );
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">LoRA Requests</h1>

      {loading ? (
        <div className="flex justify-center items-center w-full">
          <Spinner color="primary" size="lg" />
        </div>
      ) : loraRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* 2 columns in small screens and above */}
          {loraRequests.map((request) => (
            <LoraRequestCard
              key={request.id}
              loraRequestId={request.id}
              onStatusChange={updateLoraRequests}
            />
          ))}
        </div>
      ) : (
        <Card className="p-4">
          <p className="text-center">No LoRA requests found.</p>
        </Card>
      )}
    </div>
  );
};

export default LoraRequestsPage;
