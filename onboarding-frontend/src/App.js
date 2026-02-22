import { BrowserRouter, Routes, Route } from "react-router-dom";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import ApplyInternship from "./pages/candidate/ApplyInternship";
import AppliedInternships from "./pages/candidate/AppliedInternships";
import ApplicationDetails from "./pages/candidate/ApplicationDetails";

import HrDashboard from "./pages/hr/HrDashboard";
import InterviewerDashboard from "./pages/interviewer/InterviewerDashboard";
import Login from "./pages/Login";
import OnboardingForm from "./pages/OnboardingForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/internships" element={<ApplyInternship />} />
        <Route path="/candidate/applications" element={<AppliedInternships />} />
        <Route path="/candidate/application/:id" element={<ApplicationDetails />} />

        <Route path="/hr/dashboard" element={<HrDashboard />} />
        <Route path="/interviewer/:id" element={<InterviewerDashboard />} />
        <Route path="/onboarding" element={<OnboardingForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
