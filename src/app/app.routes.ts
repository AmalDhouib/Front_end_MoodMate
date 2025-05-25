import { Routes } from '@angular/router';
import { CuteChatComponent } from './cute-chat/cute-chat.component';
import { ChartComponent } from './chart/chart.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { GoogleSuccessComponent } from './google-success.component';
import { WhoareComponent } from './whoare/whoare.component';
import { AboutComponent } from './about/about.component';
import { TestimonialCarouselComponent } from './testimonial-carousel/testimonial-carousel.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }, 
  { path: 'chat', component: CuteChatComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'login', component: SignInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'google-success', component: GoogleSuccessComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
  },
  { path: 'whoare', component: WhoareComponent },
  { path: 'about', component: AboutComponent },
  { path: 'meet-mode', component: TestimonialCarouselComponent },
];
