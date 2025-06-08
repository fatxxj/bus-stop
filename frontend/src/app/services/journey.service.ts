import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journey, JourneyCreate } from '../models/journey.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private apiUrl = `${environment.apiUrl}/journeys`;

  constructor(private http: HttpClient) { }

  getJourneys(): Observable<Journey[]> {
    return this.http.get<Journey[]>(this.apiUrl);
  }

  getJourney(id: number): Observable<Journey> {
    return this.http.get<Journey>(`${this.apiUrl}/${id}`);
  }

  createJourney(journey: JourneyCreate): Observable<Journey> {
    return this.http.post<Journey>(this.apiUrl, journey);
  }

  updateJourney(id: number, journey: JourneyCreate): Observable<Journey> {
    return this.http.put<Journey>(`${this.apiUrl}/${id}`, journey);
  }

  deleteJourney(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 