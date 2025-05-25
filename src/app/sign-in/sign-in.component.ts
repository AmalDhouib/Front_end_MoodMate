import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http
      .post<any>('http://localhost:5000/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {
          const userId = response?.user_id;
          const fullName = response?.full_name;

          if (userId && fullName) {
            localStorage.setItem('user_id', userId);
            localStorage.setItem('full_name', fullName);

            // ✅ Redirection vers /home uniquement (sans paramètre)
            this.router.navigate(['/home']);
          } else {
            alert('Invalid response from server.');
          }
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Login failed! Please check your credentials.');
        }
      );
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/auth/google';
  }
}
