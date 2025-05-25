import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { ChartCommonModule } from '@swimlane/ngx-charts';
import { ChartComponent } from './chart/chart.component';
import { HttpClientModule } from '@angular/common/http';
import { CuteChatComponent } from './cute-chat/cute-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgChartsModule,
    FormsModule,
    ChartCommonModule,
    ChartComponent,
    HttpClientModule,
    CuteChatComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'emotion-tracker';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('user_id');
      const fullName = params.get('full_name');

      if (userId) {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('full_name', fullName || 'User');
        window.location.href = '/home';
      }
    }
  }
}
