import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  // login handling
  loggedIn$: any;

  // html handling
  useBackgroundImage = true; // later toggle to true when implemented

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loggedIn$ = this.auth.loggedIn$;
    this.cdr.detectChanges();
  }

  toLogin(){
    this.router.navigate(['/login']);
  }

  toRegister(){
    this.router.navigate(['/register'])
  }

  toTracker(){
    this.router.navigate(['/tracker'])
  }

  toProfile(){}
}
