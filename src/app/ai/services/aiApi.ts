"use client";
import { api } from "../../../services/api";
import Dataset from "../interfaces/Dataset";

//Workflow apis

// Fetch the list of available workflows
export const getWorkflows = async () => {
  try {
    const response = await api.get("/cui/workflows");
    return response.data;
  } catch (error) {
    console.error("Error getting workflows:", error);
    throw error;
  }
};

// Run a workflow with the provided inputs
export const runWorkflow = async (workflowId: number, inputs: unknown) => {
  try {
    const response = await api.post(`/cui/workflows/${workflowId}/run/`, {
      inputs,
    });
    return response.data; // Assuming the response contains the job ID
  } catch (error) {
    console.error("Error running workflows", error);
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
export const submitWorkflowInputs = async (inputs: unknown) => {
  try {
    const response = await api.post(`/cui/workflows/`, inputs);
    console.log(inputs);
    return response.data;
  } catch (error) {
    console.error("Submit failed:", error);
    throw error;
  }
};

// Poll the job status by job ID
export const getJob = async (jobId: number) => {
  try {
    const response = await api.get(`/cui/jobs/${jobId}`);
    return response.data; // Assuming the response contains the job status and result
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};


// Function to send the prompt to the backend and get the job ID
export const sendPromptToBackend = async (data: { prompt: string , seed : string}) => {
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
export const submitFinalData = async (imageId: number) => {
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
export const sendPromptForCharacter = async (data: {
  prompt: string;
  character_id: number;
  lora_name: string;
  seed: string;
  lora_strength : string
  aspect_ratio: string
}) => {
  try {
    const response = await api.post("/cui/workflow-runners/characters/generate-character-image/",
      data
    );
    return response.data; // Assuming this returns job_id in response
  } catch (error) {
    console.error("Failed to submit prompt:", error);
    throw error;
  }
};

//Dataset Apis

// Define the function to fetch dataset details by dataset ID
export const getDatasets = async () => {
  try {
    const response = await api.get(`/cui/datasets/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching datasets`, error);
    throw new Error('Failed to fetch dataset.');
  }
};

// Function to get a dataset by its ID
export const getDataset = async (datasetId: number) => {
  try {
    const response = await api.get(`/cui/datasets/${datasetId}/`); // Replace with the correct API endpoint
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dataset ${datasetId}:`, error);
    throw error;
  }
};

// Fetch all datasets for the user
export const getUserDatasets = async (): Promise<Dataset[]> => {
  try {
    const response = await api.get(`/cui/datasets/my-datasets/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user datasets", error);
    throw error;
  }
};


// Image Apis
// Define the function to fetch image details by image ID
export const getImageById = async (imageId: number) => {
  try {
    const response = await api.get(`/cui/dataset-images/${imageId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching image with ID ${imageId}:`, error);
    throw new Error('Failed to fetch image.');
  }
};
// Function to delete image by ID
export const deleteImageById = async (imageId: number) => {
  try {
    const response = await api.delete(`/cui/dataset-images/${imageId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting image with ID ${imageId}:`, error);
    throw new Error('Failed to delete image.');
  }
};


// Fetch Image ID From Picture
export const uploadTempImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/cui/datasets/add-temp-images/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // Returns { id: number }
};

export const requestPromptsForImage = async (data: { dataset_image_id: number }) => {
  try {
    const response = await api.post("/cui/workflow-runners/prompts/get-prompt/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to request prompts for image:", error);
    throw error;
  }
};
