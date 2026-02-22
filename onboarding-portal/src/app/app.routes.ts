import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { Login } from './pages/login/login';
import { HrDashboard } from './pages/hr/hr-dashboard/hr-dashboard';
import { CandidateDashboard } from './pages/candidate/candidate-dashboard/candidate-dashboard';
import { OnlineTest } from './pages/candidate/online-test/online-test';
import { InterviewerDashboard } from './pages/interviewer/interviewer-dashboard/interviewer-dashboard';
import { OnboardingForm } from './pages/onboarding-form/onboarding-form';
import { HrOnboardingDetails } from './pages/hr/hr-onboarding-details/hr-onboarding-details';
import { HrCreateEmployee } from './pages/hr/hr-create-employee/hr-create-employee';
import { HrEmployeeDetails } from './pages/hr/hr-employee-details/hr-employee-details';

export const routes: Routes = [

  { path: '', component: Login },

  { path: 'hr/dashboard', component: HrDashboard, canActivate:[authGuard], data:{role:'HR'} },

  { path: 'candidate/dashboard', component: CandidateDashboard, canActivate:[authGuard], data:{role:'CANDIDATE'} },

  { path: 'candidate/test/:applicationId', component: OnlineTest },

  { path: 'interviewer/:id', component: InterviewerDashboard, canActivate:[authGuard], data:{role:'INTERVIEWER'} },

  { path: 'onboarding', component: OnboardingForm },

  { path: 'hr/onboarding/:email', component: HrOnboardingDetails },

  { path: 'hr/create-employee/:email', component: HrCreateEmployee },

  { path: 'hr/employee/:email', component: HrEmployeeDetails }
];