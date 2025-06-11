import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Stop } from '../../../models/stop.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stop-details',
  templateUrl: './stop-details.component.html',
  styleUrls: ['./stop-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class StopDetailsComponent implements OnInit {
  cityName: string = '';

  constructor(
    public dialogRef: MatDialogRef<StopDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public stop: Stop,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getCityFromCoordinates(this.stop.x, this.stop.y);
  }

  getCityFromCoordinates(x: number, y: number): void {
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${y}&lon=${x}`)
      .subscribe(result => {
        this.cityName = result.display_name;
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
} 