export interface Food {
    id: number;
    name: string;
    description: string;
    image: string|File|null;
    avg_rate: number;
    meal_count: number;
  }
