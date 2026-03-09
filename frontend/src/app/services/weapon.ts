import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';

export interface Weapon {
  _id?: string;
  characterId?: string;
  weaponType?: string;
  weaponSkill?: string;
  singleShotDice?: number;
  singleShotDamage?: number;
  magazineSize?: number;
  rateOfFire?: number
  concealable?: boolean
  ammunition?: string
  cost?: number
  weaponName?: string
  weaponNotes?: string
}

@Injectable({
  providedIn: 'root',
})
export class WeaponService {

  private apiUrl = `${environment.apiUrl}/weapon`;

  constructor(private http: HttpClient, private auth: Auth) {}

  // CREATE a weapon
  createWeapon(weapon: Partial<Weapon>): Observable<Weapon> {
    const headers = this.auth.getAuthHeaders();
    return this.http.post<Weapon>(this.apiUrl, weapon, { headers });
  }

  getWeapons(): Observable<Weapon[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Weapon[]>(this.apiUrl, { headers });
  }

  getWeaponById(id: string): Observable<Weapon> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Weapon>(`${this.apiUrl}/${id}`, { headers });
  }

  updateWeaponById(id: string): Observable<Weapon> {
    const headers = this.auth.getAuthHeaders();
    return this.http.put<Weapon>(`${this.apiUrl}/${id}`, { headers });
  }

  deleteWeaponById(id: string): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  deleteAllWeaponsFromCharacterId(id: string): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/character/${id}`, { headers });
  }
}

export enum WeaponTypes {
  MediumPistol = "Medium Pistol",
  HeavyPistol = "Heavy Pistol",
  VeryHeavyPistol = "Very Heavy Pistol",
  SMG = "SMG",
  HeavySMG = "Heavy SMG",
  Shotgun = "Shotgun",
  AssaultRifle = "Assault Rifle",
  SniperRifle = "Sniper Rifle",
  BowOrCrossbow = "Bow/Crossbow",
  GrenadeLauncher = "Grenade Launcher",
  RocketLauncher = "Rocket Launcher"
}

export enum WeaponSkills {
  Handgun = "Handgun",
  ShoulderArms = "Shoulder Arms",
  Archery = "Archery",
  HeavyWeapons = "Heavy Weapons"
}
