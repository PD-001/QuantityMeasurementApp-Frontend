import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserProfile, AuthResponse } from '../../shared/models/measurement.model';

const API_BASE = 'http://localhost:8080';
const TOKEN_KEY = 'jwt_token';
const PROFILE_KEY = 'user_profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  loginWithGoogle(): void {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  }

  loginWithEmail(email: string, password: string): Observable<{ ok: boolean; data: AuthResponse }> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, { email, password }, { observe: 'response' }).pipe(
      map(res => ({ ok: res.ok, data: res.body as AuthResponse })),
      catchError(err => of({ ok: false, data: err.error as AuthResponse }))
    );
  }

  registerWithEmail(email: string, password: string, name: string): Observable<{ ok: boolean; data: AuthResponse }> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/register`, { email, password, name }, { observe: 'response' }).pipe(
      map(res => ({ ok: res.ok, data: res.body as AuthResponse })),
      catchError(err => of({ ok: false, data: err.error as AuthResponse }))
    );
  }

  loadUserProfile(): Observable<UserProfile | null> {
    const cached = localStorage.getItem(PROFILE_KEY);
    if (cached) return of(JSON.parse(cached));

    const token = this.getToken();
    if (!token) return of(null);

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<UserProfile>(`${API_BASE}/auth/me`, { headers, observe: 'response' }).pipe(
      map(res => {
        if (res.ok && res.body) {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(res.body));
          return res.body;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  clearProfileCache(): void {
    localStorage.removeItem(PROFILE_KEY);
  }

  logout(): void {
    this.clearToken();
  }

  checkUrlForToken(): boolean {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      this.setToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    return false;
  }
}
