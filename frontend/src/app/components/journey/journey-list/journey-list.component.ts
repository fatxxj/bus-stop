import { Component, OnInit } from '@angular/core';
import { Journey } from '../../../models/journey.model';
import { JourneyService } from '../../../services/journey.service';
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
import { JourneyFormComponent } from '../journey-form/journey-form.component';
import { JourneyDetailsComponent } from '../journey-details/journey-details.component';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.component.html',
  styleUrls: ['./journey-list.component.css'],
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
    JourneyFormComponent,
    JourneyDetailsComponent
  ]
})
export class JourneyListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'stops', 'actions'];
  dataSource = new MatTableDataSource<Journey>();
  loading = false;

  constructor(
    private journeyService: JourneyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadJourneys();
  }

  loadJourneys(): void {
    this.loading = true;
    this.journeyService.getJourneys().subscribe({
      next: (journeys) => {
        this.dataSource.data = journeys;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading journeys:', error);
        this.loading = false;
      }
    });
  }

  openJourneyForm(journey?: Journey): void {
    const dialogRef = this.dialog.open(JourneyFormComponent, {
      width: '600px',
      data: journey
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadJourneys();
      }
    });
  }

  openJourneyDetails(journey: Journey): void {
    this.dialog.open(JourneyDetailsComponent, {
      width: '600px',
      data: journey
    });
  }

  deleteJourney(id: number): void {
    if (confirm('Are you sure you want to delete this journey?')) {
      this.journeyService.deleteJourney(id).subscribe({
        next: () => {
          this.loadJourneys();
        },
        error: (error) => {
          console.error('Error deleting journey:', error);
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
} 