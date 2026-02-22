import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-candidate-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-dashboard.html'
})
export class CandidateDashboard implements OnInit, OnDestroy {

  user: any;

  internships: any[] = [];
  applications: any[] = [];

  selectedInternship: any = null;

  candidateName = '';
  phone = '';
  degree = '';
  college = '';
  cgpa = '';
  skills = '';
  resume!: File;

  refreshSub!: Subscription;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.user = this.auth.getUser();

    this.fetchInternships();
    this.fetchApplications();

    // 🔄 AUTO REFRESH EVERY 5s
    this.refreshSub = interval(5000).subscribe(() => {
      this.fetchInternships();
      this.fetchApplications();
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
  }

  // ================= FETCH DATA =================

  fetchInternships() {
    this.http.get<any[]>('http://localhost:8080/api/internships')
      .subscribe(res => this.internships = res);
  }

  fetchApplications() {
    this.http.get<any[]>('http://localhost:8080/api/applications')
      .subscribe(res => {
        this.applications = res.filter(
          app => app.email === this.user.email
        );
        this.cdr.detectChanges();
      });
  }

  // ================= HELPERS =================

  hasApplied(id: number) {
    return this.applications.some(app => app.internshipId === id);
  }

  getInternship(internshipId: number) {
    return this.internships.find(i => i.id === internshipId);
  }

  formatDate(date: string) {
    return date
      ? new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : '';
  }

  // ================= FILE SELECT =================

  onFileSelect(event: any) {
    this.resume = event.target.files[0];
  }

  // ================= APPLY =================

  handleApply() {

    if (!this.resume) {
      alert('Upload resume');
      return;
    }

    const internshipId = this.selectedInternship.id;

    // ✅ INSTANT UI UPDATE (REACT-LIKE)
    this.applications.push({
      internshipId,
      email: this.user.email,
      candidateName: this.candidateName,
      status: 'APPLIED'
    });

    // ✅ PREPARE API DATA
    const formData = new FormData();

    formData.append('internshipId', internshipId);
    formData.append('candidateName', this.candidateName);
    formData.append('email', this.user.email);
    formData.append('phone', this.phone);
    formData.append('degree', this.degree);
    formData.append('college', this.college);
    formData.append('cgpa', this.cgpa);
    formData.append('skills', this.skills);
    formData.append('resume', this.resume);

    // ✅ RESET FORM
    this.selectedInternship = null;
    this.candidateName = '';
    this.phone = '';
    this.degree = '';
    this.college = '';
    this.cgpa = '';
    this.skills = '';
    this.resume = null as any;

    const fileInput = document.getElementById('resumeInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.cdr.detectChanges();

    // ✅ API CALL
    this.http.post(
      'http://localhost:8080/api/applications/apply',
      formData
    ).subscribe({
      next: () => this.fetchApplications(),
      error: err => console.error(err)
    });
  }

  // ================= NAVIGATION =================

  goToTest(id: number) {
    this.router.navigate(['/candidate/test', id]);
  }

}