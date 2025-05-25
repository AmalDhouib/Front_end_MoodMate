import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-success',
  standalone: true,
  template: '<p>Signing you in...</p>',
})
export class GoogleSuccessComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      const userId = params['user_id'];
      const fullName = params['full_name'];

      if (userId) {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('full_name', fullName);

        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
