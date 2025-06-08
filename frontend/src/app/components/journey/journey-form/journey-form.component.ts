import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Journey, JourneyCreate, JourneyStop } from '../../../models/journey.model';
import { Stop } from '../../../models/stop.model';
import { JourneyService } from '../../../services/journey.service';
import { StopService } from '../../../services/stop.service';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-journey-form',
  templateUrl: './journey-form.component.html',
  styleUrls: ['./journey-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    DragDropModule,
    MatIconModule
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
        passingTime: '00:00:00'
      }));
    }
  }

  loadStops(): void {
    this.stopService.getStops().subscribe({
      next: (stops) => {
        this.stops = stops;
      },
      error: (error) => {
        console.error('Error loading stops:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.journeyForm.valid && this.selectedStops.length > 0) {
      if (this.isEditMode) {
        this.journeyStops = this.selectedStops.map((stop, index) => {
          const existingStop = this.journeyStops.find(js => js.stopId === stop.id);
          return {
            stopId: stop.id,
            order: index + 1,
            passingTime: existingStop?.passingTime || '00:00:00'
          };
        });
      } else {
        this.journeyStops = this.selectedStops.map((stop, index) => ({
          stopId: stop.id,
          order: index + 1,
          passingTime: '00:00:00'
        }));
      }

      const journeyData: JourneyCreate = {
        ...this.journeyForm.value,
        stops: this.journeyStops
      };

      if (this.isEditMode) {
        this.journeyService.updateJourney(this.data.id, journeyData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating journey:', error);
          }
        });
      } else {
        this.journeyService.createJourney(journeyData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating journey:', error);
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
} 