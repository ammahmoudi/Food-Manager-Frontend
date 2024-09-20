import { Comment } from './Comment';

export interface MealDetailsData {
  foodId: number;
  imageUrl: string;
  title: string;
  description: string;
  rating: number;
  datePosted: Date;
  comments: Comment[];
}