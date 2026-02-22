import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./CandidateDashboard.css";

function CandidateDashboard() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:8080/api/applications");

    const filtered = res.data.filter(
      (app) => app.email === user.email
    );

    setApplications(filtered);
  };

  return (
    <div className="dashboard">

      {/* 🔹 TOPBAR */}
      <div className="topbar">
        <div>
          <h2>Candidate Dashboard</h2>
          <p className="emailText">{user?.email}</p>
        </div>

        <button className="logoutBtn" onClick={() => { logout(); navigate("/"); }}>
          Logout
        </button>
      </div>

      {/* 🔹 MAIN NAVIGATION CARDS */}

      <div className="navGrid">

        <div className="navCard" onClick={() => navigate("/candidate/internships")}>
          <h3>Apply New Internship</h3>
          <p>Browse HR posted internships and apply</p>
        </div>

        <div className="navCard" onClick={() => navigate("/candidate/applications")}>
          <h3>View Applied Internships</h3>
          <p>Track all your applications</p>
        </div>

        <div className="navCard progressNavCard">
          <h3>My Progress</h3>
          <p>Live recruitment status</p>
        </div>

      </div>

      {/* 🔹 PROGRESS SECTION */}

      <h3 className="sectionTitle">Application Progress</h3>

      <div className="progressGrid">

        {applications.map((app) => (

          <div key={app.id} className="progressCard">

            <h4>{app.candidateName}</h4>

            {app.status === "TEST_PASSED" &&
              <span className="badge blue">Test Cleared</span>}

            {app.interviewStatus === "L1_SCHEDULED" &&
              <span className="badge yellow">L1 Interview Scheduled</span>}

            {app.interviewStatus === "L2_SCHEDULED" &&
              <span className="badge yellow">L2 Interview Scheduled</span>}

            {app.interviewStatus === "HR_SCHEDULED" &&
              <span className="badge yellow">HR Interview Scheduled</span>}

            {app.hrResult === "PASSED" &&
              <span className="badge green">HR Cleared</span>}

            {app.offerLetterFile &&
              <span className="badge purple">Offer Released</span>}

            {app.signedOfferLetter &&
              <span className="badge cyan">Offer Accepted</span>}

          </div>

        ))}

      </div>

    </div>
  );
}

export default CandidateDashboard;
