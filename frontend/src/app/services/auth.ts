import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;  // backend API URL
  private dashboardUrl = `${environment.apiUrl}/dashboard`;  // backend API URL

  // reactive login handling
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn()) 
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  // send login request to backend, returns token and user info on success
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials); 
  }

  // send registration request to backend, returns user info on success
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // store token in local storage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // remove token from local storage
  logout(): void {
    localStorage.removeItem('authToken');
    this.loggedIn.next(false);
  }

  // check if user is logged in by verifying token
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  setLoggedIn() {
    this.loggedIn.next(true);
  }

  // helper to get headers with auth token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTokenVerification(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/auth-guard/protected`, { headers });
  }

  getAdminVerification(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/auth-guard/admin`, { headers });
  }
}
