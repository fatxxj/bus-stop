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

  constructor(
    private fb: FormBuilder,
    private stopService: StopService,
    private dialogRef: MatDialogRef<StopFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Stop
  ) {
    this.stopForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      description: ['', Validators.required],
      x: ['', [Validators.required, Validators.pattern('^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$')]],
      y: ['', [Validators.required, Validators.pattern('^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$')]]
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
    }
  }

  onSubmit(): void {
    if (this.stopForm.valid) {
      const stopData: StopCreate = this.stopForm.value;

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