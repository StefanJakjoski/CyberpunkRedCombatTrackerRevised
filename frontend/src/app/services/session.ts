import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Session {
  
  private apiUrl = `${environment.apiUrl}/session`;

  constructor(private http: HttpClient, private auth: Auth) {}

  // GET all sessions (filtered by backend for user/admin)
  getSessions(): Observable<any[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // GET a single session by ID
  getSessionById(id: string): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // CREATE a new session (current user is owner)
  createSession(session: Partial<any>): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, session, { headers });
  }

  // UPDATE a session (must be owner/admin)
  updateSession(id: string, session: Partial<any>): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, session, { headers });
  }

  // DELETE a session (must be owner/admin)
  deleteSession(id: string): Observable<{ message: string }> {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }

  // POST a user to the allowedUsers list of an existing session
  // UPDATE IN BACKEND
  joinSession(sessionId: string) {
    const headers = this.auth.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${sessionId}/join`, {}, { headers });
  }
}
