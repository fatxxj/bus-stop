import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Journey } from '../../../models/journey.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.component.html',
  styleUrls: ['./journey-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag
  ]
})
export class JourneyDetailsComponent implements OnInit {
  isEditMode: boolean = false;
  selectedStops: any[] = [];
  stops: any[] = [];
  journeyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<JourneyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public journey: Journey,
    private fb: FormBuilder
  ) {
    this.journeyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[A-Z0-9]+$')]],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.journey) {
      this.isEditMode = true;
      this.journeyForm.patchValue({
        code: this.journey.code,
        description: this.journey.description
      });
      this.selectedStops = [...this.journey.stops];
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.journeyForm.valid && this.selectedStops.length > 0) {
      const formData = {
        ...this.journeyForm.value,
        stops: this.selectedStops
      };
      this.dialogRef.close(formData);
    }
  }

  addStop(stop: any): void {
    if (!this.isStopSelected(stop)) {
      this.selectedStops.push(stop);
    }
  }

  removeStop(stop: any): void {
    const index = this.selectedStops.indexOf(stop);
    if (index > -1) {
      this.selectedStops.splice(index, 1);
    }
  }

  isStopSelected(stop: any): boolean {
    return this.selectedStops.some(s => s.id === stop.id);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.selectedStops, event.previousIndex, event.currentIndex);
  }
} 