export interface Stop {
    id: number;
    code: string;
    description: string;
    x: number;
    y: number;
}

export interface StopCreate {
    code: string;
    description: string;
    x: number;
    y: number;
} 