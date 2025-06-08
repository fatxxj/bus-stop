import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Journey } from '../../../models/journey.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.component.html',
  styleUrls: ['./journey-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule
  ]
})
export class JourneyDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<JourneyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public journey: Journey
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
} 