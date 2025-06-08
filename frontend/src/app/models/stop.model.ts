export interface Stop {
    id: number;
    code: string;
    description: string;
    x: number;
    y: number;
    isActive: boolean;
    connections?: number[];
}

export interface StopCreate {
    code: string;
    description: string;
    x: number;
    y: number;
    isActive?: boolean;
} 