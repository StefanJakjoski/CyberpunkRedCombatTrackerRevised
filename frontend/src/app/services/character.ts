import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { Weapon } from './weapon';

export interface Character {
  _id?: string;
  sessionId: string;
  ownerId?: string;
  name?: string;
  health?: number;
  armor?: number;
  headArmor?: number,
  initiative?: number;
  weapons?: Weapon[];
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  
  private apiUrl = `${environment.apiUrl}/character`;

  constructor(private http: HttpClient, private auth: Auth) {}
  
  // GET all characters (filtered backend)
  getCharacters(): Observable<Character[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Character[]>(this.apiUrl, { headers });
  }

  // GET a single character by ID
  getCharacterById(id: string): Observable<Character> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Character>(`${this.apiUrl}/${id}`, { headers });
  }

  getCharactersBySessionId(sessionId: string): Observable<Character[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Character[]>(`${this.apiUrl}/session/${sessionId}`, { headers });
  }

  // CREATE a character
  createCharacter(character: Partial<Character>): Observable<Character> {
    const headers = this.auth.getAuthHeaders();
    return this.http.post<Character>(this.apiUrl, character, { headers });
  }

  // UPDATE a character
  updateCharacter(id: string, character: Partial<Character>): Observable<Character> {
    const headers = this.auth.getAuthHeaders();
    return this.http.put<Character>(`${this.apiUrl}/${id}`, character, { headers });
  }

  // DELETE a character
  deleteCharacter(id: string): Observable<{ message: string }> {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }
}
