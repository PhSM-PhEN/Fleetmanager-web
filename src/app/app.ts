import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environments';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {


  private api = inject(ApiService)
  constructor(){
    this.api.get('vehicle').subscribe();
  }
  protected readonly title = signal('fleetmanager-web');
  
  
}
console.log(environment);