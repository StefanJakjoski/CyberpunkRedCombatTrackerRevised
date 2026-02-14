import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Session } from '../../services/session';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracker-hub',
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker-hub.html',
  styleUrl: './tracker-hub.css',
})
export class TrackerHub implements OnInit{
  joinSessionId = '';
  isLoading = false;
  error = '';

  allSessions: any[] = [];
  loadingSessions = false;

  constructor(private session: Session, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadingSessions = true;

    this.session.getSessions().subscribe({
      next: (response) => {
        this.allSessions = response;
        this.cdr.detectChanges();
        this.loadingSessions = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingSessions = false;
      }
    });
  }

  joinSession() {
    if (!this.joinSessionId) return;

    this.isLoading = true;
    this.error = '';

    this.session.joinSession(this.joinSessionId).subscribe({
      next: () => {
        this.router.navigate(['/tracker', this.joinSessionId]);
      },
      error: err => {
        this.error = err.error?.message || 'Failed to join session';
        this.isLoading = false;
      }
    });
  }

  createSession() {
    this.isLoading = true;
    this.error = '';

    this.session.createSession({}).subscribe({
      next: (response) => {
        this.router.navigate(['/tracker', response._id]);
      },
      error: err => {
        this.error = err.error?.message || 'Failed to create session';
        this.isLoading = false;
      }
    });
  }

  goToSession(sessionId: string) {
    this.router.navigate(['/tracker', sessionId]);
  }
}
