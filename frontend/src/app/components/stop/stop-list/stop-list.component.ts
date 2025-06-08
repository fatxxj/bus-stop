import { Component, OnInit } from '@angular/core';
import { Stop } from '../../../models/stop.model';
import { StopService } from '../../../services/stop.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { StopFormComponent } from '../stop-form/stop-form.component';
import { StopDetailsComponent } from '../stop-details/stop-details.component';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    StopFormComponent,
    StopDetailsComponent
  ]
})
export class StopListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'coordinates', 'actions'];
  dataSource = new MatTableDataSource<Stop>();
  loading = false;

  constructor(
    private stopService: StopService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadStops();
  }

  loadStops(): void {
    this.loading = true;
    this.stopService.getStops().subscribe({
      next: (stops) => {
        this.dataSource.data = stops;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stops:', error);
        this.loading = false;
      }
    });
  }

  openStopForm(stop?: Stop): void {
    const dialogRef = this.dialog.open(StopFormComponent, {
      width: '500px',
      data: stop
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStops();
      }
    });
  }

  openStopDetails(stop: Stop): void {
    this.dialog.open(StopDetailsComponent, {
      width: '500px',
      data: stop
    });
  }

  deleteStop(id: number): void {
    if (confirm('Are you sure you want to delete this stop?')) {
      this.stopService.deleteStop(id).subscribe({
        next: () => {
          this.loadStops();
        },
        error: (error) => {
          console.error('Error deleting stop:', error);
          alert('Cannot delete stop as it is being used by one or more journeys.');
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
} 