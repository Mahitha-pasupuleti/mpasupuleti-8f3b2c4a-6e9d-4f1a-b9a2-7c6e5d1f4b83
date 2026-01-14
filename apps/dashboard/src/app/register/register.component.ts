import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = '';
  email = '';
  role: 'VIEWER' | 'ADMIN' | 'OWNER' = 'VIEWER';
  orgId = ''; // user can enter or select org
  success = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.orgId) {
      this.error = 'All fields are required';
      return;
    }

    const payload = {
      name: this.name,
      email: this.email,
      role: this.role,
      orgId: this.orgId,
    };

    this.http.post('http://localhost:3000/api/auth/register', payload)
      .subscribe({
        next: () => {
          this.success = 'Registration successful!';
          this.error = '';
          setTimeout(() => this.router.navigate(['/login']), 500);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Registration failed';
          this.success = '';
        },
      });
  }
}
