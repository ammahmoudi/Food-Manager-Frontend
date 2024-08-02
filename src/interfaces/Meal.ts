import { Food } from './Food';

export interface Meal {
  comments: never[];
  id: number;
  date: string;
  food: Food | null;
  imageUrl: string;
  title: string;
  description: string;
  rating: number;
  datePosted: string;
}