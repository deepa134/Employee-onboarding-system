import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-hr-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-dashboard.html'
})
export class HrDashboard implements OnInit {

  title = '';
  location = '';
  ctc = '';
  description = '';
  companyName = '';

  pdfFile!: File;
  uploadedFileName = '';

  pdfUploading = false;
  posting = false;

  internships: any[] = [];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchInternships();
  }

  logout() {
    this.auth.logout();
  }

  fetchInternships() {
    this.http.get<any[]>('http://localhost:8080/api/internships')
      .subscribe(res => {
        this.internships = res;
        this.cdr.detectChanges();
      });
  }

  onFileSelect(event: any) {
    this.pdfFile = event.target.files[0];
  }

  uploadPdf() {

    if (!this.pdfFile) {
      alert('Select PDF first');
      return;
    }

    this.pdfUploading = true;

    const formData = new FormData();
    formData.append('file', this.pdfFile);

    this.http.post(
      'http://localhost:8080/api/internships/upload-pdf',
      formData,
      { responseType: 'text' }
    ).subscribe({
      next: (res) => {
        this.uploadedFileName = res;
        this.pdfUploading = false;
        this.cdr.detectChanges();
        alert('PDF uploaded ✅');
      },
      error: () => this.pdfUploading = false
    });
  }

  postInternship() {

    if (!this.uploadedFileName) {
      alert('Upload PDF first');
      return;
    }

    this.posting = true;

    const formData = new FormData();

    formData.append('companyName', this.companyName);
    formData.append('title', this.title);
    formData.append('location', this.location);
    formData.append('ctc', this.ctc);
    formData.append('description', this.description);
    formData.append('pdfFileName', this.uploadedFileName);

    this.http.post(
      'http://localhost:8080/api/internships/post',
      formData,
      { responseType: 'text' }
    ).subscribe({

      next: () => {

        alert('Internship posted ✅');

        this.resetForm();

        this.fetchInternships();

        this.posting = false;
      },

      error: () => this.posting = false
    });
  }

  resetForm() {
    this.title = '';
    this.location = '';
    this.ctc = '';
    this.description = '';
    this.companyName = '';
    this.uploadedFileName = '';

    const fileInput = document.getElementById('pdfInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.cdr.detectChanges();
  }

  deleteInternship(id: number) {
    this.http.delete(`http://localhost:8080/api/internships/${id}`)
      .subscribe(() => this.fetchInternships());
  }
}