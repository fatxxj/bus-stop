import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Components
import { AppComponent } from './app.component';
import { JourneyListComponent } from './components/journey/journey-list/journey-list.component';
import { JourneyFormComponent } from './components/journey/journey-form/journey-form.component';
import { JourneyDetailsComponent } from './components/journey/journey-details/journey-details.component';
import { StopListComponent } from './components/stop/stop-list/stop-list.component';
import { StopFormComponent } from './components/stop/stop-form/stop-form.component';
import { StopDetailsComponent } from './components/stop/stop-details/stop-details.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatListModule,
    DragDropModule,
    AppComponent,
    JourneyListComponent,
    JourneyFormComponent,
    JourneyDetailsComponent,
    StopListComponent,
    StopFormComponent,
    StopDetailsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 