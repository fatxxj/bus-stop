import { Component, OnInit, ViewChild } from '@angular/core';
import { Stop } from '../../../models/stop.model';
import { StopService, PaginatedResponse } from '../../../services/stop.service';
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
import { StopFormComponent } from '../stop-form/stop-form.component';
import { StopDetailsComponent } from '../stop-details/stop-details.component';
import { AuthService } from '../../../services/auth.service';

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
    MatSortModule
  ]
})
export class StopListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'description', 'coordinates', 'actions'];
  dataSource = new MatTableDataSource<Stop>();
  loading = false;
  isAuthenticated = false;
  totalItems = 0;
  pageSize = 4;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private stopService: StopService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit(): void {
    this.loadStops();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadStops(): void {
    this.loading = true;
    this.stopService.getStops(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Stop>) => {
        this.dataSource.data = response.items;
        this.totalItems = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stops:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadStops();
  }

  openStopForm(stop?: Stop): void {
    const dialogRef = this.dialog.open(StopFormComponent, {
      // width: '500px',
      width: '40vw',  // 90% of viewport width
      maxWidth: '1600px',  // Optional: set a maximum width
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
      // width: '500px',
      width: '40vw',  // 90% of viewport width
      maxWidth: '1600px',  // Optional: set a maximum width
      data: stop
    });
  }

  deleteStop(stop: Stop): void {
    if (confirm('Are you sure you want to delete this stop?')) {
      this.stopService.deleteStop(stop.id).subscribe({
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

  getActiveStops(): number {
    return this.dataSource.data.filter(stop => stop.isActive).length;
  }

  getRouteConnections(): number {
    return this.dataSource.data.reduce((total, stop) => total + stop.connections, 0);
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.applyFilter({ target: { value: '' } } as any);
  }

  getFilteredStops(): Stop[] {
    return this.dataSource.filteredData;
  }

  isHighlighted(stop: Stop): boolean {
    // Add logic to highlight featured stops if needed
    return false;
  }

  viewStop(stop: Stop): void {
    this.openStopDetails(stop);
  }
} 