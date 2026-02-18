import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  useBackgroundImage: boolean = true;

  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
  
  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.loading = false;
        this.auth.saveToken(res.token);  // Save token using Auth service
        this.auth.setLoggedIn();
        this.router.navigate(['/dashboard']); // Navigate to dashboard on success
      },
      error: (err) => {
        console.error('Login error', err);
        this.loading = false;
        this.error = 'Login failed';
      },
      complete: () => { this.loading = false; }
    });
  }

  onRegister(){
    this.router.navigate(['/register']);
  }
}
