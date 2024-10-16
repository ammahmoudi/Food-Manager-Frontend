"use client";
import { api } from "../../../services/api";
import Dataset from "../interfaces/Dataset";
import { CharacterFormData } from '../interfaces/CharacterFormData';

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

// Poll the job by job ID
export const getJob = async (jobId: number) => {
  try {
    const response = await api.get(`/cui/jobs/${jobId}`);
    return response.data;
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




// Send prompt with selected character and lora to the backend
export const sendPromptForCharacter = async (data: {
  prompt: string;
  character_id: number;
  lora_name: string;
  seed: string;
  lora_strength : string
  aspect_ratio: string
  reference_image? : number
  reference_strength? : string
}) => {
  try {
    const response = await api.post("/cui/workflow-runners/characters/generate-character-image/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to submit prompt:", error);
    throw error;
  }
};

//Dataset Apis

export const getDatasets = async () => {
  try {
    const response = await api.get(`/cui/datasets/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching datasets`, error);
    throw new Error('Failed to fetch dataset.');
  }
};

export const getDataset = async (datasetId: number) => {
  try {
    const response = await api.get(`/cui/datasets/${datasetId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dataset ${datasetId}:`, error);
    throw error;
  }
};

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

export const getImageById = async (imageId: number | undefined) => {
  try {
    const response = await api.get(`/cui/dataset-images/${imageId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching image with ID ${imageId}:`, error);
    throw new Error('Failed to fetch image.');
  }
};

export const deleteImageById = async (imageId: number) => {
  try {
    const response = await api.delete(`/cui/dataset-images/${imageId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting image with ID ${imageId}:`, error);
    throw new Error('Failed to delete image.');
  }
};


export const uploadTempImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/cui/datasets/add-temp-images/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const requestPromptsForImage = async (data: { dataset_image_id: number | undefined }) => {
  try {
    const response = await api.post("/cui/workflow-runners/prompts/get-prompt/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to request prompts for image:", error);
    throw error;
  }
};


//Character Form Apis

export const getCharacters = async () => {
  try {
    const response = await api.get("/cui/characters/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch characters and loras:", error);
    throw error;
  }
};

export const addCharacter = async (character: CharacterFormData) => {
	const response = await api.post("/cui/characters/", character, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};

export const updateCharacter = async (id: number, character: CharacterFormData) => {
	const response = await api.put(`/cui/characters/${id}/`, character, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const deleteCharacter = async (id: number) => {
	const response = await api.delete(`/cui/characters/${id}/`);
	return response.data;
};


// Lora Api

export const getLoraRequest = async (id: number) => {
  try {
    const response = await api.get(`/cui/lora-requests/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Lora request with ID ${id}:`, error);
    throw error;
  }
};

export const updateLoraRequestStatus = async (id: number,status: 'canceled' | 'accepted' | 'denied') => {
  try {
    const response = await api.post(`/cui/lora-requests/${id}/update-status/`, {"status": status});
    return response.data;
  } catch (error) {
    console.error(`Error canceling Lora request with ID ${id}:`, error);
    throw error;
  }
};