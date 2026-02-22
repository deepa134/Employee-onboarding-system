import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: any = JSON.parse(localStorage.getItem('user') || 'null');

  constructor(private router: Router) {}

  login(role: string, data: any = {}) {
    this.user = { role, ...data };
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.user;
  }
}