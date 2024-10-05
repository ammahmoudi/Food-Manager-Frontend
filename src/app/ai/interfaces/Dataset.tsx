
export default interface Dataset {
    id: number;
    name: string;
    created_by: number;
    crated_at: string;
    character : number | null;
    jobs? : number[];
    images? : number[]
    dataset_type: string
  }