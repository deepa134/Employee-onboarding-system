import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CandidateDashboard() {

  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [candidateName, setCandidateName] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchInternships();
    fetchApplications();

    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchInternships = async () => {
    const res = await axios.get("http://localhost:8080/api/internships");
    setInternships(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:8080/api/applications");
    setApplications(res.data);
  };

  const hasApplied = (internshipId) => {
    return applications.some((app) => app.internshipId === internshipId);
  };

  const handleApply = async () => {

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("internshipId", selectedInternship.id);
    formData.append("candidateName", candidateName);
    formData.append("email", "manid6134@gmail.com");
    formData.append("phone", phone);
    formData.append("degree", degree);
    formData.append("college", college);
    formData.append("cgpa", cgpa);
    formData.append("skills", skills);
    formData.append("resume", resume);

    try {
      await axios.post("http://localhost:8080/api/applications/apply", formData);
      alert("Application submitted!");
      setSelectedInternship(null);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Application failed");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <h1>Candidate Dashboard</h1>

      <h2>Available Internships</h2>

      {internships.map((i) => (
        <div key={i.id} style={card}>
          <h3>{i.title}</h3>
          <p><b>Location:</b> {i.location}</p>
          <p><b>CTC:</b> {i.ctc}</p>
          <p><b>Description:</b> {i.description}</p>

          {hasApplied(i.id)
            ? <button disabled style={appliedBtn}>Applied</button>
            : <button onClick={() => setSelectedInternship(i)} style={applyBtn}>Apply</button>}
        </div>
      ))}

      {selectedInternship && (
        <div style={formBox}>

          <h2>Apply for {selectedInternship.title}</h2>

          <input placeholder="Full Name" onChange={(e) => setCandidateName(e.target.value)} style={input}/>
          <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} style={input}/>
          <input placeholder="Degree" onChange={(e) => setDegree(e.target.value)} style={input}/>
          <input placeholder="College" onChange={(e) => setCollege(e.target.value)} style={input}/>
          <input placeholder="CGPA" onChange={(e) => setCgpa(e.target.value)} style={input}/>
          <input placeholder="Skills" onChange={(e) => setSkills(e.target.value)} style={input}/>
          <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])}/>

          <button onClick={handleApply} style={submitBtn}>
            Submit Application
          </button>

        </div>
      )}

      <h2 style={{ marginTop: "40px" }}>My Applications</h2>

      {applications.map((app) => {

        const internship = internships.find(i => i.id === app.internshipId);

        return (
          <div key={app.id} style={card}>

            <h3>{internship?.title}</h3>

            <p><b>Status:</b> {app.status}</p>

            {app.score !== null && (
              <p><b>Score:</b> {app.score} / 15</p>
            )}

            
            {app.status === "TEST_ACTIVE" && (
              <>
                <p><b>Test Active Until:</b> {app.testDate}</p>

                <button
                  onClick={() => navigate(`/candidate/test/${app.id}`)}
                  style={testBtn}
                >
                  Take Test
                </button>
              </>
            )}

           
            {app.status === "TEST_PASSED" && (
              <>
                <p style={{ color: "green", fontWeight: "bold" }}>
                   You cleared the online test
                </p>

                {!app.interviewStatus && (
                  <p style={{ color: "blue" }}>
                    Waiting for HR to schedule interview
                  </p>
                )}
              </>
            )}

            
            {app.status === "TEST_FAILED" && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                ❌ You did not clear the online test
              </p>
            )}

            
            {app.status === "TEST_PASSED" &&
             app.interviewStatus === "L1_SCHEDULED" && (
              <div style={interviewBox}>
                 L1 Interview Scheduled <br />
                📅 Date: {app.interviewDate} <br />
                ⏰ Time: {app.interviewTime}
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default CandidateDashboard;

/* ================= STYLES ================= */

const card = {
  border: "1px solid #ccc",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
  background: "#f9f9f9"
};

const applyBtn = {
  padding: "6px 12px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 4
};

const appliedBtn = {
  padding: "6px 12px",
  background: "gray",
  color: "#fff",
  border: "none",
  borderRadius: 4
};

const submitBtn = {
  marginTop: 15,
  padding: "10px 20px",
  background: "green",
  color: "#fff",
  border: "none",
  borderRadius: 5
};

const input = {
  width: "100%",
  marginBottom: 10,
  padding: 8
};

const formBox = {
  marginTop: 30,
  padding: 20,
  background: "#f4f4f4",
  borderRadius: 8
};

const testBtn = {
  padding: "8px 15px",
  background: "orange",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  marginTop: 10
};

const interviewBox = {
  marginTop: "10px",
  padding: "12px",
  background: "#e8f5e9",
  borderRadius: "8px",
  color: "green",
  fontWeight: "bold"
};
