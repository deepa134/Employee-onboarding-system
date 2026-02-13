import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HrDashboard from "./pages/hr/HrDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import OnlineTest from "./pages/candidate/OnlineTest";
import InterviewerDashboard from "./pages/interviewer/InterviewerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/candidate" />} />

        {/* HR Dashboard */}
        <Route path="/hr" element={<HrDashboard />} />

        {/* Candidate Dashboard */}
        <Route path="/candidate" element={<CandidateDashboard />} />

        {/* Online Test */}
        <Route path="/candidate/test/:applicationId" element={<OnlineTest />} />

        {/* ✅ DYNAMIC INTERVIEWER ROUTE */}
        <Route path="/interviewer/:id" element={<InterviewerDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
