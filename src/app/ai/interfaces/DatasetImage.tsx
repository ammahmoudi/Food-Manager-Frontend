export default interface DatasetImage {
    id: number;
    name: string;
    job: number | null
    complex_prompt: string | null
    tag_prompt: string | null
    negative_prompt: string | null
    created_by: number;
    crated_at: string;
    character : number | null;
    images : string
}