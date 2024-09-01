import { User } from "@/interfaces/User"; // Adjust the import path as necessary
import { Meal } from "@/interfaces/Meal";

export interface Comment {
  id: number; // Unique identifier for the comment
  user: User; // User who made the comment
  text: string; // Text content of the comment
  createdAt: string; // Creation date of the comment
  updatedAt: string; // Last updated date of the comment
  meal: Meal; // Meal associated with the comment, which includes food details
}
