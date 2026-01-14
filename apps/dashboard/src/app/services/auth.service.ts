import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method: stores access_token in localStorage
  login(email: string): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${this.baseUrl}/login`, { email })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.access_token);
        })
      );
  }

  // Registration
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { name, email, password });
  }

  // Retrieve JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout: clears token and optionally navigates to login
  logout(redirect: boolean = true) {
    localStorage.removeItem('token');
    if (redirect) this.router.navigate(['/login']);
  }

  // Get HTTP headers with JWT for API calls
  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  // Decode JWT to get user info
  getUserFromToken(): { id: string; role: 'owner' | 'admin' | 'viewer'; orgId: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1]; // JWT middle part
      return JSON.parse(atob(payload));    // decode Base64 -> JSON
    } catch {
      return null;
    }
  }
}
