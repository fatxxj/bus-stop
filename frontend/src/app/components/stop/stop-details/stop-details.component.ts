import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Stop } from '../../../models/stop.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
export class StopDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<StopDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public stop: Stop
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
} 