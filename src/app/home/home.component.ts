import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TestimonialCarouselComponent } from '../testimonial-carousel/testimonial-carousel.component';
import { AboutComponent } from '../about/about.component';
import { FeaturesSectionComponent } from '../features-section/features-section.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { WhoareComponent } from '../whoare/whoare.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    TestimonialCarouselComponent,
    AboutComponent,
    FeaturesSectionComponent,
    FooterComponent,
    CommonModule,
    WhoareComponent,
  ],
})
export class HomeComponent implements AfterViewInit {
  scrolled = false;
  isLoggedIn = false;
  fullName = '';
  menuOpen = false;

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      const fullName = localStorage.getItem('full_name');

      if (userId) {
        this.isLoggedIn = true;
        this.fullName = fullName || 'User';
      }
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.scrolled = window.scrollY > 50;
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && this.bgVideo?.nativeElement) {
      const videoElement = this.bgVideo.nativeElement;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.playbackRate = 0.9;
      });
    }
  }

  startChat() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/chat']);
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('full_name');
    }
    this.isLoggedIn = false;
    this.fullName = '';
    this.router.navigate(['/home']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
