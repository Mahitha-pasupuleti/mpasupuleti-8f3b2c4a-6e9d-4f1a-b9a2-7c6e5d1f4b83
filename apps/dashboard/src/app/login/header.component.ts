import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <a routerLink="/tasks" *ngIf="isLoggedIn()">Tasks</a>
      <a routerLink="/login" *ngIf="!isLoggedIn()">Login</a>
      <button *ngIf="isLoggedIn()" (click)="logout()">Logout</button>
    </nav>
  `,
  styles: [`
    nav { display: flex; gap: 10px; padding: 10px; background: #f2f2f2; }
    button { cursor: pointer; }
  `]
})
export class HeaderComponent {
  constructor(private auth: AuthService) {}

  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  logout() {
    this.auth.logout(); // removes token + navigates to /login
  }
}
