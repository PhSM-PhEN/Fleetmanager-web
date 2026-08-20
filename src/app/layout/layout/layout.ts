import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Adicionado RouterLinkActive

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Adicionado RouterLinkActive aqui
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {}
