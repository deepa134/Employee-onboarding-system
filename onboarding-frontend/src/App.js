import { BrowserRouter, Routes, Route } from "react-router-dom";
import HrDashboard from "./pages/hr/HrDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import OnlineTest from "./pages/candidate/OnlineTest";
import InterviewerDashboard from "./pages/interviewer/InterviewerDashboard";
import Login from "./pages/Login";
import OnboardingForm from "./pages/OnboardingForm";
import HrOnboardingDetails from "./pages/hr/HrOnboardingDetails";
import HrCreateEmployee from "./pages/hr/HrCreateEmployee";
import HrEmployeeDetails from "./pages/hr/HrEmployeeDetails";



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
        <Route path="/hr/onboarding/:email" element={<HrOnboardingDetails />} />
        <Route path="/hr/create-employee/:email" element={<HrCreateEmployee />} />
        <Route path="/hr/employee/:email" element={<HrEmployeeDetails />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
