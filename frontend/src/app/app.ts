
import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { WeatherService, WeatherForecast } from './services/weather.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NgFor],
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
