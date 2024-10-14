export interface Job {
    id: number;
    workflow: number;
    status: 'pending' | 'completed' | 'failed' | 'running';
    runtime: string;
    images: number[];
    result_data: {
        [node_id: string]: {
            [input_name: string]: {
                id: number;
                type: string;
                value: string; // imageURL
            };
        };
    };
    input_data: Record<string, Record<string, string>>; //JSON
    logs: string;
    user: number;
    dataset: number;
    progress : number
}
