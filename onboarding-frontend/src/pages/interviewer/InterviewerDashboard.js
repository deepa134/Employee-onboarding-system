import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function InterviewerDashboard() {

  const { id: interviewerId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div>

      <h2>Interviewer Dashboard</h2>

      {applications.length === 0 && <p>No interview requests</p>}

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
          <div key={app.id}>

            <h3>{app.candidateName}</h3>
            <p>{app.email}</p>

            <p><b>Level:</b> {level}</p>

            <p><b>Date:</b> {formatDate(date)}</p>
            <p><b>Time:</b> {formatTime(time)}</p>
            <p><b>Mode:</b> {mode}</p>

            {interviewerStatus === "REQUESTED" && (
              <>
                <p>HR assigned this interview</p>

                <button onClick={() =>
                  respondToRequest(app.id, "ACCEPTED")
                }>
                  Accept
                </button>

                <button onClick={() =>
                  respondToRequest(app.id, "REJECTED")
                }>
                  Reject
                </button>
              </>
            )}

            {interviewerStatus === "ACCEPTED" &&
             app.interviewStatus.includes("SCHEDULED") && (
              <>
                <p>Interview accepted</p>

                <button
                  disabled={resultDone}
                  onClick={() =>
                    updateResult(
                      app.id,
                      level === "L1" ? "L1_PASSED" : "L2_PASSED"
                    )
                  }
                >
                  Mark as Passed
                </button>

                <button
                  disabled={resultDone}
                  onClick={() =>
                    updateResult(
                      app.id,
                      level === "L1" ? "L1_FAILED" : "L2_FAILED"
                    )
                  }
                >
                  Mark as Failed
                </button>
              </>
            )}

            {level === "L1" && app.l1Result === "PASSED" && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                Candidate cleared this round
              </p>
            )}

            {level === "L2" && app.l2Result === "PASSED" && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                Candidate cleared this round
              </p>
            )}

            {level === "L1" && app.l1Result === "FAILED" && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                Candidate failed this round
              </p>
            )}

            {level === "L2" && app.l2Result === "FAILED" && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                Candidate failed this round
              </p>
            )}

            <hr />

          </div>
        );
      })}

    </div>
  );
}

export default InterviewerDashboard;
