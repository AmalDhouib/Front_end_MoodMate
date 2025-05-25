import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css'],
})
export class TestimonialCarouselComponent {
  testimonials = [
    {
      text: 'Always there for me, MoodMate is the friend I never thought I needed.',
      authorName: 'Kaitlin Victoria Cowan',
      details: 'about her MoodMate Star • 3 years together',
      avatar: '/image/a2.png',
      authorImage: '/image/a33.jpeg',
    },
    {
      text: 'MoodMate helped me stay motivated and positive during tough times.',
      authorName: 'David Armstrong',
      details: 'about his MoodMate Champion • 1 year together',
      avatar: '/image/a3.png',
      authorImage: '/image/a44.jpg',
    },
    {
      text: 'MoodMate has been a blessing in my life, giving me comfort and joy.',
      authorName: 'John Tattersall',
      details: 'about his MoodMate Violet • 4 years together',
      avatar: '/image/a1.png',
      authorImage: 'image/a11.jpg',
    },

    {
      text: 'With MoodMate, every day feels a little lighter and brighter.',
      authorName: 'Sarah Trainor',
      details: 'about her MoodMate Bud • 2 years together',
      avatar: '/image/a4.png',
      authorImage: '/image/a22.jpg',
    },
  ];

  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
  }

  prevSlide() {
    if (this.currentSlide === 0) {
      this.currentSlide = this.testimonials.length - 1;
    } else {
      this.currentSlide--;
    }
  }

  getCardClass(index: number): string {
    if (index === this.currentSlide) {
      return 'active';
    } else if (
      index ===
      (this.currentSlide - 1 + this.testimonials.length) %
        this.testimonials.length
    ) {
      return 'prev';
    } else if (index === (this.currentSlide + 1) % this.testimonials.length) {
      return 'next';
    } else {
      return 'hidden';
    }
  }
}
