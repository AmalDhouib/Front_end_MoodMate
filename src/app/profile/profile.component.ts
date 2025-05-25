import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  username: string = '';

  constructor(private router: Router) {
    this.username = localStorage.getItem('username') || 'Unknown User';
  }

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    this.router.navigate(['/home']);
  }
}
