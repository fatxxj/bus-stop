import { Component, OnInit, ViewChild } from '@angular/core';
import { Journey } from '../../../models/journey.model';
import { JourneyService } from '../../../services/journey.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { JourneyFormComponent } from '../journey-form/journey-form.component';
import { JourneyDetailsComponent } from '../journey-details/journey-details.component';
import { AuthService } from '../../../services/auth.service';
import { PaginatedResponse } from '../../../services/stop.service';

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
    MatSortModule
  ]
})
export class JourneyListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'stops', 'actions'];
  dataSource = new MatTableDataSource<Journey>();
  loading = false;
  isAuthenticated = false;
  totalItems = 0;
  pageSize = 4;
  currentPage = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private journeyService: JourneyService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit(): void {
    this.loadJourneys();
  }

  loadJourneys(): void {
    this.loading = true;
    this.journeyService.getJourneys(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Journey>) => {
        this.dataSource.data = response.items;
        this.totalItems = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading journeys:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadJourneys();
  }

  openJourneyForm(journey?: Journey): void {
    const dialogRef = this.dialog.open(JourneyFormComponent, {
      width: '98vw',  // 90% of viewport width
      maxWidth: '1600px',  // Optional: set a maximum width
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
      // width: '1400px',
      width: '98vw',  // 90% of viewport width
      maxWidth: '1600px',  // Optional: set a maximum width
      data: journey
    });
  }

   getTotalStops(): number {
    return this.dataSource.data.reduce((total, journey) => {
      return total + (journey.stops?.length || 0);
    }, 0);
  }

  getFilteredJourneys(): Journey[] {
    return this.dataSource.filteredData;
  }

  isHighlighted(journey: Journey): boolean {
    // Add logic to highlight featured journeys if needed
    return false;
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.applyFilter({ target: { value: '' } } as any);
  }

  viewJourney(journey: Journey): void {
    const dialogRef = this.dialog.open(JourneyDetailsComponent, {
      width: '800px',
      data: journey
    });
  }


  deleteJourney(journey: Journey): void {
    if (confirm('Are you sure you want to delete this journey?')) {
      this.journeyService.deleteJourney(journey.id).subscribe({
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    this.dataSource.filterPredicate = (journey: Journey, filter: string) => {
      // Check journey code and description
      const matchesJourneyInfo = 
        journey.code.toLowerCase().includes(filter) ||
        (journey.description && journey.description.toLowerCase().includes(filter));
      
      // Check stops
      const matchesStops = journey.stops.some(stop => 
        stop.code.toLowerCase().includes(filter) ||
        (stop.description && stop.description.toLowerCase().includes(filter))
      );
      
      return matchesJourneyInfo || matchesStops;
    };
    
    this.dataSource.filter = filterValue;
  }
} 