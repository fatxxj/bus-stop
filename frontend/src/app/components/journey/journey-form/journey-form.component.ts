import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Journey, JourneyCreate, JourneyStop } from '../../../models/journey.model';
import { Stop } from '../../../models/stop.model';
import { JourneyService } from '../../../services/journey.service';
import { StopService, PaginatedResponse } from '../../../services/stop.service';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-journey-form',
  templateUrl: './journey-form.component.html',
  styleUrls: ['./journey-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    DragDropModule,
    MatIconModule,
    MatTimepickerModule,
    MatNativeDateModule
  ]
})
export class JourneyFormComponent implements OnInit {
  journeyForm: FormGroup;
  stops: Stop[] = [];
  selectedJourneyStops: any[] = []; // Use JourneyStopWithTime[]
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private journeyService: JourneyService,
    private stopService: StopService,
    private dialogRef: MatDialogRef<JourneyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Journey
  ) {
    this.journeyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStops();
    if (this.data) {
      this.isEditMode = true;
      this.journeyForm.patchValue({
        code: this.data.code,
        description: this.data.description
      });
      // Use the incoming stops as the selectedJourneyStops
      this.selectedJourneyStops = this.data.stops.map((stop: any, index: number) => ({
        ...stop,
        order: index + 1,
        passingTime: stop.passingTime ? stop.passingTime.substring(0, 5) : '00:00',
      }));
    }
  }

  loadStops(): void {
    this.stopService.getStops(1, 1000).subscribe({
      next: (response: any) => {
        this.stops = response.items;
      },
      error: (error: any) => {
        console.error('Error loading stops:', error);
      }
    });
  }

  addStop(stop: Stop): void {
    if (!this.selectedJourneyStops.find(s => s.stopId === stop.id)) {
      this.selectedJourneyStops.push({
        stopId: stop.id,
        code: stop.code,
        description: stop.description,
        x: stop.x,
        y: stop.y,
        order: this.selectedJourneyStops.length + 1,
        passingTime: '00:00',
        cityName: stop.cityName || '',
      });
    }
  }

  removeStop(stop: any): void {
    const index = this.selectedJourneyStops.findIndex(s => s.stopId === stop.stopId);
    if (index !== -1) {
      this.selectedJourneyStops.splice(index, 1);
      // Reorder
      this.selectedJourneyStops = this.selectedJourneyStops.map((s, idx) => ({ ...s, order: idx + 1 }));
    }
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.selectedJourneyStops, event.previousIndex, event.currentIndex);
    this.selectedJourneyStops = this.selectedJourneyStops.map((s, idx) => ({ ...s, order: idx + 1 }));
  }

  isStopSelected(stop: Stop): boolean {
    return this.selectedJourneyStops.some(s => s.stopId === stop.id);
  }

  updatePassingTime(stopId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = input.value;
    const stop = this.selectedJourneyStops.find(s => s.stopId === stopId);
    if (stop) {
      stop.passingTime = time;
    }
  }

  getAvailableStops(): Stop[] {
    return this.stops.filter(stop => !this.isStopSelected(stop));
  }

  getFilteredAvailableStops(): Stop[] {
    const available = this.getAvailableStops();
    if (!this.searchTerm) return available;
    const term = this.searchTerm.toLowerCase();
    return available.filter(stop =>
      stop.code.toLowerCase().includes(term) ||
      stop.description.toLowerCase().includes(term)
    );
  }

  calculateRouteDistance(): string {
    if (this.selectedJourneyStops.length < 2) return '0';
    let totalDistance = 0;
    for (let i = 0; i < this.selectedJourneyStops.length - 1; i++) {
      const stop1 = this.selectedJourneyStops[i];
      const stop2 = this.selectedJourneyStops[i + 1];
      const lat1 = stop1.y * Math.PI / 180;
      const lon1 = stop1.x * Math.PI / 180;
      const lat2 = stop2.y * Math.PI / 180;
      const lon2 = stop2.x * Math.PI / 180;
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const R = 6371;
      const distance = R * c;
      totalDistance += distance;
    }
    return totalDistance.toFixed(1);
  }

  clearAllStops(): void {
    this.selectedJourneyStops = [];
  }

  reverseRoute(): void {
    this.selectedJourneyStops.reverse();
    this.selectedJourneyStops = this.selectedJourneyStops.map((s, idx) => ({ ...s, order: idx + 1 }));
  }

  searchTerm: string = '';
  isFormSubmitting: boolean = false;

  onSubmit(): void {
    if (this.journeyForm.valid && this.selectedJourneyStops.length >= 2) {
      this.isFormSubmitting = true;
      const journeyData: JourneyCreate = {
        ...this.journeyForm.value,
        stops: this.selectedJourneyStops.map(stop => ({
          stopId: stop.stopId,
          order: stop.order,
          passingTime: stop.passingTime + ':00', // Ensure format is HH:mm:ss
        }))
      };
      if (this.isEditMode) {
        this.journeyService.updateJourney(this.data.id, journeyData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error updating journey:', error);
            this.isFormSubmitting = false;
          }
        });
      } else {
        this.journeyService.createJourney(journeyData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error creating journey:', error);
            this.isFormSubmitting = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 