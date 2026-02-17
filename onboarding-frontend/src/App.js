import { BrowserRouter, Routes, Route } from "react-router-dom";
import HrDashboard from "./pages/hr/HrDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import OnlineTest from "./pages/candidate/OnlineTest";
import InterviewerDashboard from "./pages/interviewer/InterviewerDashboard";
import Login from "./pages/Login";
import OnboardingForm from "./pages/OnboardingForm";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/test/:applicationId" element={<OnlineTest />} />
        <Route path="/interviewer/:id" element={<InterviewerDashboard />} />
        <Route path="/onboarding" element={<OnboardingForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
