export interface Stop {
    id: number;
    code: string;
    description: string;
    x: number;
    y: number;
    cityName: string;
    isActive: boolean;
    connections?: number[];
}

export interface StopCreate {
    code: string;
    description: string;
    x: number;
    y: number;
    cityName: string;
    isActive?: boolean;
} 