import Dataset from "./Dataset";

export default interface Character {
    id: number;
    name: string;
    image: string;
    loras: Record<string, string>;
    datasets: Dataset[];
    description: string;
  }