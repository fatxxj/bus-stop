import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  summary: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) { }

  getForecast(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(`${environment.backendUrl}/WeatherForecast`);
  }
}
