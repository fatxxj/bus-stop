import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Stop, StopCreate } from '../../../models/stop.model';
import { StopService } from '../../../services/stop.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stop-form',
  templateUrl: './stop-form.component.html',
  styleUrls: ['./stop-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class StopFormComponent implements OnInit {
  stopForm: FormGroup;
  isEditMode = false;
  private citySearchSubject = new Subject<string>();
  citySearchResults: any[] = [];
  isSearching = false;

  constructor(
    private fb: FormBuilder,
    private stopService: StopService,
    private dialogRef: MatDialogRef<StopFormComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: Stop
  ) {
    this.stopForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      description: ['', Validators.required],
      x: ['', [Validators.required, Validators.pattern('^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$')]],
      y: ['', [Validators.required, Validators.pattern('^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$')]],
      cityName: ['']
    });

    // Setup city search subscription
    this.citySearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(city => this.searchCity(city))
    ).subscribe(results => {
      this.citySearchResults = results;
      this.isSearching = false;
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.stopForm.patchValue({
        code: this.data.code,
        description: this.data.description,
        x: this.data.x,
        y: this.data.y
      });
      // If we have coordinates, try to get the city name
      if (this.data.x && this.data.y) {
        this.getCityFromCoordinates(this.data.x, this.data.y);
      }
    }
  }

  searchCity(city: string) {
    if (!city) {
      this.citySearchResults = [];
      return [];
    }
    this.isSearching = true;
    return this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=5`);
  }

  onCitySearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.citySearchSubject.next(input.value);
  }

  selectCity(city: any) {
    this.stopForm.patchValue({
      x: city.lon,
      y: city.lat,
      cityName: city.display_name
    });
    this.citySearchResults = [];
  }

  getCityFromCoordinates(x: number, y: number) {
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${y}&lon=${x}`)
      .subscribe(result => {
        this.stopForm.patchValue({
          cityName: result.display_name
        });
      });
  }

  onCoordinatesChange() {
    const x = this.stopForm.get('x')?.value;
    const y = this.stopForm.get('y')?.value;
    if (x && y) {
      this.getCityFromCoordinates(x, y);
    }
  }

  onSubmit(): void {
    if (this.stopForm.valid) {
      const stopData: StopCreate = {
        code: this.stopForm.value.code,
        description: this.stopForm.value.description,
        x: this.stopForm.value.x,
        y: this.stopForm.value.y
      };

      if (this.isEditMode) {
        this.stopService.updateStop(this.data.id, stopData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating stop:', error);
          }
        });
      } else {
        this.stopService.createStop(stopData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating stop:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 