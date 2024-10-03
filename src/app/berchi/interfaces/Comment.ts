import { User } from "@/interfaces/User"; // Adjust the import path as necessary
import { Meal } from "./Meal";

export interface Comment {
  id: number; // Unique identifier for the comment
  user: User; // User who made the comment
  text: string; // Text content of the comment
  created_at: Date; // Creation date of the comment
  updated_at: Date; // Last updated date of the comment
  meal: Meal; // Meal associated with the comment, which includes food details
}
