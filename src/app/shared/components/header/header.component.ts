import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  readonly userName = signal('Marcos Maure'); // o lo que tengas
  readonly userInitial = computed(
    () => this.userName()[0]?.toUpperCase() ?? '?'
  );

  /** INPUTS */
  readonly title = input.required<string>();
  readonly items = input<number>(0);

  constructor() { }


}
