import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyListComponent } from './components/journey/journey-list/journey-list.component';
import { StopListComponent } from './components/stop/stop-list/stop-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, JourneyListComponent, StopListComponent]
})
export class AppComponent {
  title = 'TUG\'s Bus Company Operations';
  activeTab: 'journeys' | 'stops' = 'journeys';

  switchTab(tab: 'journeys' | 'stops') {
    this.activeTab = tab;
  }
}