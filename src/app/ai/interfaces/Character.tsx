import Dataset from "./Dataset";

export default interface Character {
    id: number;
    name: string;
    image: string; 
    loras: Record<string, string>; // Loras is an object with name-path pairs
    datasets: Dataset[];
  }