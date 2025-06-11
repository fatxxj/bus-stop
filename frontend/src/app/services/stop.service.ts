import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stop, StopCreate } from '../models/stop.model';
import { environment } from '../../environments/environment';

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StopService {
  private apiUrl = `${environment.apiUrl}/stops`;

  constructor(private http: HttpClient) { }

  getStops(pageNumber: number = 1, pageSize: number = 4): Observable<PaginatedResponse<Stop>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<PaginatedResponse<Stop>>(this.apiUrl, { params });
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