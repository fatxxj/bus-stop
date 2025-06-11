import { Stop } from './stop.model';

export interface JourneyStopWithTime extends Stop {
    passingTime: string;
}

export interface Journey {
    id: number;
    code: string;
    description: string;
    stops: JourneyStopWithTime[];
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