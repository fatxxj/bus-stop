import { Stop } from './stop.model';

export interface Journey {
    id: number;
    code: string;
    description: string;
    stops: Stop[];
}

export interface JourneyStop {
    stopId: number;
    order: number;
    passingTime: string; // TimeSpan will be sent as string in ISO format
}

export interface JourneyCreate {
    code: string;
    description: string;
    stops: JourneyStop[];
} 