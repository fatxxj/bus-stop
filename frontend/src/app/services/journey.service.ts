import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journey, JourneyCreate } from '../models/journey.model';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from './stop.service';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private apiUrl = `${environment.apiUrl}/journeys`;

  constructor(private http: HttpClient) { }

  getJourneys(pageNumber: number = 1, pageSize: number = 4): Observable<PaginatedResponse<Journey>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedResponse<Journey>>(this.apiUrl, { params });
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