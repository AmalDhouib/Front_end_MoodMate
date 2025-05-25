import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fullNameSubject = new BehaviorSubject<string | null>(null);
  fullName$ = this.fullNameSubject.asObservable();

  constructor() {}

  init() {
    if (typeof window !== 'undefined') {
      const fullName = localStorage.getItem('full_name');
      this.fullNameSubject.next(fullName);
    }
  }

  login(userId: string, fullName: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', userId);
      localStorage.setItem('full_name', fullName);
    }
    this.fullNameSubject.next(fullName);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('full_name');
    }
    this.fullNameSubject.next(null);
  }
}
