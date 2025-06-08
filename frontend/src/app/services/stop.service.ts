import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stop, StopCreate } from '../models/stop.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StopService {
  private apiUrl = `${environment.apiUrl}/stops`;

  constructor(private http: HttpClient) { }

  getStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(this.apiUrl);
  }

  getStop(id: number): Observable<Stop> {
    return this.http.get<Stop>(`${this.apiUrl}/${id}`);
  }

  createStop(stop: StopCreate): Observable<Stop> {
    return this.http.post<Stop>(this.apiUrl, stop);
  }

  updateStop(id: number, stop: StopCreate): Observable<Stop> {
    return this.http.put<Stop>(`${this.apiUrl}/${id}`, stop);
  }

  deleteStop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 