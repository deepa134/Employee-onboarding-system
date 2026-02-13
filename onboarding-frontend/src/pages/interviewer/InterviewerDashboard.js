import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


function InterviewerDashboard() {

  // ✅ TEMP → later from login
  
  const { id: interviewerId } = useParams();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/applications/interviewer/${interviewerId}`
      );
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const respondToRequest = async (applicationId, status) => {
    try {
      await axios.post(
        "http://localhost:8080/api/applications/interviewer-response",
        null,
        { params: { applicationId, status } }
      );

      fetchApplications();

    } catch (err) {
      console.error(err);
    }
  };

  const updateResult = async (applicationId, result) => {
    try {

      await axios.post(
        "http://localhost:8080/api/applications/update-interview-result",
        null,
        { params: { applicationId, result } }
      );

      fetchApplications();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      <h2>Interviewer Dashboard</h2>

      {applications.length === 0 && <p>No interview requests</p>}

      {applications.map((app) => {

        const isResultDone =
          app.interviewStatus === "L1_PASSED" ||
          app.interviewStatus === "L1_FAILED" ||
          app.interviewStatus === "L2_PASSED" ||
          app.interviewStatus === "L2_FAILED";

        return (

          <div key={app.id}>

            <h3>{app.candidateName}</h3>

            <p>Email: {app.email}</p>
            <p>Date: {app.interviewDate}</p>
            <p>Time: {app.interviewTime}</p>
            <p>Mode: {app.mode}</p>
            <p>Level: {app.interviewLevel}</p>

            {/* ================= HR REQUEST ================= */}

            {app.interviewerStatus === "REQUESTED" && (
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

            {/* ================= ACCEPTED ================= */}

            {app.interviewerStatus === "ACCEPTED" &&
             app.interviewStatus.includes("SCHEDULED") && (

              <>
                <p>You accepted this interview</p>

                <button
                  disabled={isResultDone}
                  onClick={() =>
                    updateResult(
                      app.id,
                      app.interviewLevel === "L1"
                        ? "L1_PASSED"
                        : "L2_PASSED"
                    )
                  }
                >
                  Mark as Passed
                </button>

                <button
                  disabled={isResultDone}
                  onClick={() =>
                    updateResult(
                      app.id,
                      app.interviewLevel === "L1"
                        ? "L1_FAILED"
                        : "L2_FAILED"
                    )
                  }
                >
                  Mark as Failed
                </button>

                {isResultDone && <p>Result submitted</p>}
              </>
            )}

            {/* ================= REJECTED ================= */}

            {app.interviewerStatus === "REJECTED" && (
              <p>You rejected this request</p>
            )}

            {/* ================= FINAL STATUS ================= */}

            {app.interviewStatus === "L1_PASSED" && <p>L1 Cleared</p>}
            {app.interviewStatus === "L1_FAILED" && <p>L1 Failed</p>}
            {app.interviewStatus === "L2_PASSED" && <p>Selected ✅</p>}
            {app.interviewStatus === "L2_FAILED" && <p>Rejected ❌</p>}

            <hr />

          </div>
        );
      })}

    </div>
  );
}

export default InterviewerDashboard;
