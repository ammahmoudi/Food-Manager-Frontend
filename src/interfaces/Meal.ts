import { Food } from './Food';

export interface Meal {
  comments: never[];
  id: number;
  date: Date;
  food: Food | null;
  imageUrl: string;
  title: string;
  description: string;
  rating: number;
  datePosted: Date;
}