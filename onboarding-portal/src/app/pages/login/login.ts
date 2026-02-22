import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html'
})
export class Login {

  role = '';
  email = '';
  name = '';
  password = '';

  interviewers: any = {
    Kavya: { id: 1, password: 'kavya123' },
    Arun: { id: 2, password: 'arun123' },
    Divya: { id: 3, password: 'divya123' }
  };

  constructor(private auth: AuthService, private router: Router) {}

  handleLogin() {

    if (this.role === 'CANDIDATE') {

      if (!this.email) {
        alert('Enter email');
        return;
      }

      this.auth.login('CANDIDATE', { email: this.email });
      this.router.navigate(['/candidate/dashboard']);
    }

    if (this.role === 'HR') {
      this.auth.login('HR');
      this.router.navigate(['/hr/dashboard']);
    }

    if (this.role === 'INTERVIEWER') {

      const interviewer = this.interviewers[this.name];

      if (!interviewer || interviewer.password !== this.password) {
        alert('Invalid credentials');
        return;
      }

      this.auth.login('INTERVIEWER', {
        interviewerId: interviewer.id,
        interviewerName: this.name
      });

      this.router.navigate([`/interviewer/${interviewer.id}`]);
    }
  }
}