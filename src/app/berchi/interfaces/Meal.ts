import { Food } from './Food';

export interface Meal {
  comments: Comment[];
  id: number;
  date: Date;
  food: Food | null;
  avg_rate: number;
}