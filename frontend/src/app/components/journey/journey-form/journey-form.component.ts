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
  selectedStops: Stop[] = [];
  isEditMode = false;
  journeyStops: JourneyStop[] = [];

  constructor(
    private fb: FormBuilder,
    private journeyService: JourneyService,
    private stopService: StopService,
    private dialogRef: MatDialogRef<JourneyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Journey
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
      this.selectedStops = [...this.data.stops];
      this.journeyStops = this.data.stops.map((stop, index) => ({
        stopId: stop.id,
        order: index + 1,
        passingTime: stop.passingTime || '00:00:00'
      }));
    }
  }

  loadStops(): void {
    this.stopService.getStops(1, 1000).subscribe({
      next: (response: PaginatedResponse<Stop>) => {
        this.stops = response.items;
      },
      error: (error) => {
        console.error('Error loading stops:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.journeyForm.valid && this.selectedStops.length >= 2) {
      this.isFormSubmitting = true;
      // Always preserve the current passingTime for each stop
      this.journeyStops = this.selectedStops.map((stop, index) => {
        const existingStop = this.journeyStops.find(js => js.stopId === stop.id);
        return {
          stopId: stop.id,
          order: index + 1,
          passingTime: existingStop?.passingTime || '00:00:00'
        };
      });

      const journeyData: JourneyCreate = {
        ...this.journeyForm.value,
        stops: this.journeyStops.map(stop => ({
          stopId: stop.stopId,
          order: stop.order,
          passingTime: stop.passingTime + ':00' // Ensure format is HH:mm:ss
        }))
      };

      if (this.isEditMode) {
        this.journeyService.updateJourney(this.data.id, journeyData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating journey:', error);
            this.isFormSubmitting = false;
          }
        });
      } else {
        this.journeyService.createJourney(journeyData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
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

  addStop(stop: Stop): void {
    if (!this.selectedStops.find(s => s.id === stop.id)) {
      this.selectedStops.push(stop);
      this.journeyStops.push({
        stopId: stop.id,
        order: this.selectedStops.length,
        passingTime: '00:00:00'
      });
    }
  }

  removeStop(stop: Stop): void {
    const index = this.selectedStops.findIndex(s => s.id === stop.id);
    if (index !== -1) {
      this.selectedStops.splice(index, 1);
      this.journeyStops.splice(index, 1);
      this.journeyStops = this.journeyStops.map((journeyStop, idx) => ({
        ...journeyStop,
        order: idx + 1
      }));
    }
  }

  drop(event: CdkDragDrop<Stop[]>): void {
    moveItemInArray(this.selectedStops, event.previousIndex, event.currentIndex);
    this.journeyStops = this.selectedStops.map((stop, index) => {
      const existingStop = this.journeyStops.find(js => js.stopId === stop.id);
      return {
        stopId: stop.id,
        order: index + 1,
        passingTime: existingStop?.passingTime || '00:00:00'
      };
    });
  }

  isStopSelected(stop: Stop): boolean {
    return this.selectedStops.some(s => s.id === stop.id);
  }

  searchTerm: string = '';
  isFormSubmitting: boolean = false;

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
    if (this.selectedStops.length < 2) return '0';
    
    let totalDistance = 0;
    for (let i = 0; i < this.selectedStops.length - 1; i++) {
      const stop1 = this.selectedStops[i];
      const stop2 = this.selectedStops[i + 1];
      
      // Convert coordinates to radians
      const lat1 = stop1.y * Math.PI / 180;
      const lon1 = stop1.x * Math.PI / 180;
      const lat2 = stop2.y * Math.PI / 180;
      const lon2 = stop2.x * Math.PI / 180;
      
      // Haversine formula
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      // Earth's radius in kilometers
      const R = 6371;
      const distance = R * c;
      
      totalDistance += distance;
    }
    
    return totalDistance.toFixed(1);
  }

  clearAllStops(): void {
    this.selectedStops = [];
    this.journeyStops = [];
  }

  reverseRoute(): void {
    this.selectedStops.reverse();
    this.journeyStops = this.selectedStops.map((stop, index) => ({
      stopId: stop.id,
      order: index + 1,
      passingTime: '00:00:00'
    }));
  }

  updatePassingTime(stopId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = input.value;
    const journeyStop = this.journeyStops.find(js => js.stopId === stopId);
    if (journeyStop) {
      journeyStop.passingTime = time;
      console.log('Updated passingTime:', journeyStop);
    } else {
      console.warn('JourneyStop not found for stopId:', stopId);
    }
  }

  getPassingTime(stopId: number): string {
    const journeyStop = this.journeyStops.find(js => js.stopId === stopId);
    return journeyStop?.passingTime || '00:00:00';
  }
} 