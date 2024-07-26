import { Comment } from './Comment';
import { MealWithFood } from './MealWithFood';

export interface FoodDetailsData {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  rating: number;
  datePosted: string;
  comments: Comment[];
  meals: MealWithFood[];

  [key: string]: any; // Allows for additional properties
}