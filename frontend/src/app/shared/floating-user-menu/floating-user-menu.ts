import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-user-menu',
  imports: [CommonModule],
  templateUrl: './floating-user-menu.html',
  styleUrl: './floating-user-menu.css',
})
export class FloatingUserMenu implements OnInit{

  loggedIn$: any;
  
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.loggedIn$ = this.auth.loggedIn$;
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/dashboard']);
  }

  toLogin(){
    this.router.navigate(['/login']);
  }

  toRegister(){
    this.router.navigate(['/register']);
  }

  toProfile(){
    // fix later
  }
}
