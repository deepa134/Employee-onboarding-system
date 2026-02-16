import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function InterviewerDashboard() {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const interviewerId = user?.interviewerId;

  const [applications, setApplications] = useState([]);

  useEffect(() => {

    if (!user || user.role !== "INTERVIEWER") {
      navigate("/");
      return;
    }

    fetchApplications();

    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);

  }, [user]);

  const fetchApplications = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/applications/interviewer/${interviewerId}`
    );
    setApplications(res.data);
  };

  const respondToRequest = async (applicationId, status) => {
    await axios.post(
      "http://localhost:8080/api/applications/interviewer-response",
      null,
      { params: { applicationId, status } }
    );
    fetchApplications();
  };

  const updateResult = async (applicationId, result) => {
    await axios.post(
      "http://localhost:8080/api/applications/update-interview-result",
      null,
      { params: { applicationId, result } }
    );
    fetchApplications();
  };

  const formatDate = (dateString) =>
    dateString &&
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={page}>

     
      <div style={header}>
        <h2 style={{ margin: 0 }}>
          Welcome {user?.interviewerName}
        </h2>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={logoutBtn}
        >
          Logout
        </button>
      </div>

      {applications.length === 0 && <p style={{ opacity: 0.6 }}>No interview requests</p>}

      {applications.map((app) => {

        const isL1 = Number(interviewerId) === app.l1InterviewerId;
        const level = isL1 ? "L1" : "L2";

        const interviewerStatus = isL1
          ? app.l1InterviewerStatus
          : app.l2InterviewerStatus;

        const date = isL1 ? app.l1Date : app.l2Date;
        const time = isL1 ? app.l1Time : app.l2Time;
        const mode = isL1 ? app.l1Mode : app.l2Mode;

        const resultDone = level === "L1"
          ? app.l1Result === "PASSED" || app.l1Result === "FAILED"
          : app.l2Result === "PASSED" || app.l2Result === "FAILED";

        return (
          <div key={app.id} style={card}>

            <div style={rowBetween}>
              <h3 style={{ margin: 0 }}>{app.candidateName}</h3>
              <span style={levelBadge}>{level}</span>
            </div>

            

            <div style={infoGrid}>
              <span><b>Date:</b> {formatDate(date)}</span>
              <span><b>Time:</b> {formatTime(time)}</span>
              <span><b>Mode:</b> {mode}</span>
            </div>

            {interviewerStatus === "REQUESTED" && (
              <>
                <p style={muted}>HR assigned this interview</p>

                <div style={btnRow}>
                  <button onClick={() => respondToRequest(app.id, "ACCEPTED")} style={primaryBtn}>
                    Accept
                  </button>

                  <button onClick={() => respondToRequest(app.id, "REJECTED")} style={secondaryBtn}>
                    Reject
                  </button>
                </div>
              </>
            )}

            {interviewerStatus === "ACCEPTED" &&
             app.interviewStatus.includes("SCHEDULED") && (
              <>
                <p style={muted}>Interview accepted</p>

                <div style={btnRow}>
                  <button
                    disabled={resultDone}
                    onClick={() =>
                      updateResult(app.id, level === "L1" ? "L1_PASSED" : "L2_PASSED")
                    }
                    style={primaryBtn}
                  >
                    Mark as Passed
                  </button>

                  <button
                    disabled={resultDone}
                    onClick={() =>
                      updateResult(app.id, level === "L1" ? "L1_FAILED" : "L2_FAILED")
                    }
                    style={secondaryBtn}
                  >
                    Mark as Failed
                  </button>
                </div>
              </>
            )}

            {level === "L1" && app.l1Result === "PASSED" && <p style={success}>Candidate cleared this round</p>}
            {level === "L2" && app.l2Result === "PASSED" && <p style={success}>Candidate cleared this round</p>}
            {level === "L1" && app.l1Result === "FAILED" && <p style={fail}>Candidate failed this round</p>}
            {level === "L2" && app.l2Result === "FAILED" && <p style={fail}>Candidate failed this round</p>}

          </div>
        );
      })}
    </div>
  );
}

export default InterviewerDashboard;



const page = {
  padding: 40,
  background: "white",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 30
};

const logoutBtn = {
  background: "#000",
  color: "#fff",
  padding: "4px 12px",
  border: "none",
  borderRadius: 6,
  fontSize: 13,
  cursor: "pointer"
};

const card = {
  background: "#f5f5f5",
  padding: 20,
  borderRadius: 10,
  border: "1px solid white",
  marginBottom: 20
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const levelBadge = {
  fontSize: 12,
  background: "#f5f5f5",
  padding: "3px 8px",
  borderRadius: 6
};

const email = {
  marginTop: 4,
  fontSize: 13,
  opacity: 0.7
};

const infoGrid = {
  display: "flex",
  gap: 20,
  marginTop: 10,
  fontSize: 14
};

const btnRow = {
  display: "flex",
  gap: 10,
  marginTop: 10
};

const primaryBtn = {
  background: "#000",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13
};

const secondaryBtn = {
  background: "#eaeaea",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13
};

const muted = { fontSize: 13, opacity: 0.7 };
const success = { color: "black", fontWeight: "bold", fontSize: 13 };
const fail = { color: "red", fontWeight: 500, fontSize: 13 };
