import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule]
})
export class NavbarComponent {
  scrolled = false;
  isLoggedIn = false;
  username = '';

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      const username = localStorage.getItem('username');

      if (userId) {
        this.isLoggedIn = true;
        this.username = username || 'USER';
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
    }
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/home']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
