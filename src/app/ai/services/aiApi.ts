"use client";
import { api } from "../../../services/api";

// Fetch the list of available workflows
export const getWorkflows = async () => {
  try {
    const response = await api.get("/cui/workflows");
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Run a workflow with the provided inputs
export const runWorkflow = async (workflowId: number, inputs: any) => {
  try {
    const response = await api.post(`/cui/workflows/${workflowId}/run/`, {
      inputs,
    });
    return response.data; // Assuming the response contains the job ID
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Poll the job status by job ID
export const getJob = async (jobId: number) => {
  try {
    const response = await api.get(`/cui/jobs/${jobId}`);
    return response.data; // Assuming the response contains the job status and result
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Sample API function for fetching nodes with POST request
export const fetchNodesFromJson = async (jsonData: string) => {
  const response = await api.post(`/cui/workflows/nodes/`, {
    json_data: jsonData,
  });
  return response.data;
};

// Function to submit workflow inputs
export const submitWorkflowInputs = async (inputs: any) => {
  try {
    const response = await api.post(`/cui/workflows/`, inputs);
    console.log(input);
    return response.data;
  } catch (error) {
    console.error("Submit failed:", error);
    throw error;
  }
};

// Function to get images by JobID
export const getImagesByJobID = async (jobId: string) => {
  try {
    const response = await api.get(`/cui/jobs/${jobId}`);
    console.log("Images fetched for jobID:", jobId);
    return response.data; // Expecting { image_urls: ["url1", "url2", ...] }
  } catch (error) {
    console.error("Failed to fetch images by JobID:", error);
    throw error;
  }
};

// Function to send the prompt to the backend and get the job ID
export const sendPromptToBackend = async (data: { prompt: string }) => {
  try {
    const response = await api.post(
      "/cui/workflow-runners/characters/prompt/",
      data
    ); // Replace with the correct API endpoint
    return response.data;
  } catch (error) {
    console.error("Error submitting prompt:", error);
    throw error;
  }
};

// Function to submit the final data (using job ID) and get dataset ID
export const submitFinalData = async (imageId: string) => {
  try {
    const response = await api.post(
      `/cui/workflow-runners/characters/generate-character-samples/`,
      { dataset_image_id: imageId }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting final data:", error);
    throw error;
  }
};

// Function to get a dataset by its ID
export const getDataset = async (datasetId: string) => {
  try {
    const response = await api.get(`/cui/datasets/${datasetId}/`); // Replace with the correct API endpoint
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dataset ${datasetId}:`, error);
    throw error;
  }
};

// Fetch characters and their associated Loras from backend
export const getCharacters = async () => {
  console.log("i'm here");
  try {
    const response = await api.get("/cui/characters/");
    console.log(response.data);
    return response.data; // Assuming response contains the characters and loras
  } catch (error) {
    console.error("Failed to fetch characters and loras:", error);
    throw error;
  }
};

// Send prompt with selected character and lora to the backend
export const sendPromptforCharacter = async (data: {
  prompt: string;
  character_id: string;
  lora_name: string;
}) => {
  try {
    const response = await api.post(
      "/cui/characters/generate-charachter-image/",
      data
    );
    return response.data; // Assuming this returns job_id in response
  } catch (error) {
    console.error("Failed to submit prompt:", error);
    throw error;
  }
};
