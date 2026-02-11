import { BrowserRouter, Routes, Route } from "react-router-dom";
import HrDashboard from "./pages/hr/HrDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hr" element={<HrDashboard />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
