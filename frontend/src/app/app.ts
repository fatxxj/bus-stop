import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService, WeatherForecast } from './services/weather.service';
import { JourneyListComponent } from './components/journey/journey-list/journey-list.component';
import { StopListComponent } from './components/stop/stop-list/stop-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JourneyListComponent, StopListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
  protected weather: WeatherForecast[] = [];
  protected error: string | null = null;

  private weatherService = inject(WeatherService);

  constructor() {
    effect(() => {
      this.weatherService.getForecast().subscribe({
        next: (data) => {
          this.weather = data;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Failed to load weather data';
        }
      });
    });
  }
}
