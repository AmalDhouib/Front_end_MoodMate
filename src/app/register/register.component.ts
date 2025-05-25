import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.http
      .post<any>('http://localhost:5000/register', {
        full_name: this.fullName,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' },
          });
        },
        (error) => {
          console.error('Registration failed:', error);

          if (
            error.status === 400 &&
            error.error?.error === 'Email already exists.'
          ) {
            this.errorMessage =
              'This email already exists. Please try to login.';
          } else if (
            error.status === 409 &&
            error.error?.error === 'Name and password already exist.'
          ) {
            this.errorMessage =
              'A user with this name and password already exists.';
            alert(this.errorMessage); 
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      );
  }

  registerWithGoogle() {
    window.location.href = 'http://localhost:5000/auth/google';
  }
}
