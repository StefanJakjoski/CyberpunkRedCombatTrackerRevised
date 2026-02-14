import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  passwordC: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private auth: Auth, private router: Router) {}

  onRegister() {
    if(this.password !== this.passwordC){
      this.error = 'Passwords must match'
      return;
    }

    this.loading = true;

    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        this.loading = false;
        this.router.navigate(['/login']); // Navigate to login on success
      },
      error: (err) => {
        console.error('Registration error', err);
        this.loading = false;
        this.error = 'Registration failed';
      },
      complete: () => { this.loading = false; }
    });
  }
}
