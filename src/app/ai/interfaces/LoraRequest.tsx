// Interface for the User data in the LoRARequest
export interface LoraRequestUser {
    id: number;
    full_name: string;
    user_image: string; // Assuming 'user_image' is a URL or a string representing the image path
  }
  
  // Interface for the Character data in the LoRARequest
  export interface LoraRequestCharacter {
    id: number;
    name: string;
    image: string; // Assuming 'image' is a URL or a string representing the image path
  }
  
  // Interface for the LoRA type in the LoRARequest
  export interface LoraRequestType {
    id: number;
    name: string;
  }
  
  // Interface for the main LoRARequest
  export interface LoraRequest {
    id: number;
    name: string;
    status: 'accepted' | 'running' | 'waiting' | 'denied' | 'canceled' | 'failed' | 'completed'; // The status field as a union of string literals
    created_at: string; // ISO date string
    last_modified: string; // ISO date string
    trigger_word: string;
    user: LoraRequestUser; // The user object
    character: LoraRequestCharacter; // The character object
    job: number; // Assuming 'job' is a numeric ID
    dataset: number; // Assuming 'dataset' is a numeric ID
    lora_type: LoraRequestType; // The LoRA type object
  }