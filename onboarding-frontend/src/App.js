import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HrDashboard from "./pages/hr/HrDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import OnlineTest from "./pages/candidate/OnlineTest";

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

        {/* Online Test Page */}
        <Route path="/candidate/test/:applicationId" element={<OnlineTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
