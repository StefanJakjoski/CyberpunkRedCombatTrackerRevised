import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TrackerHub } from './pages/tracker-hub/tracker-hub';
import { authGuard } from './guards/auth-guard';
import { TrackerSession } from './pages/tracker-session/tracker-session';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'tracker', canActivate: [authGuard], component: TrackerHub },
  { path: 'tracker/:sessionId', canActivate: [authGuard], component: TrackerSession },
];
