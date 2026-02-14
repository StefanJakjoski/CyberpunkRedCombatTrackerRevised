import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-reroute-menu',
  imports: [CommonModule],
  templateUrl: './floating-reroute-menu.html',
  styleUrl: './floating-reroute-menu.css',
})
export class FloatingRerouteMenu {


  loggedIn$: any;
  
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.loggedIn$ = this.auth.loggedIn$;
  }

  toDashboard(){
    this.router.navigate(['/dashboard']);
  }

  toTracker(){
    this.router.navigate(['/tracker']);
  }
}
