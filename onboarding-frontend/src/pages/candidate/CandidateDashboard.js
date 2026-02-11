import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function CandidateDashboard() {
  const { user } = useContext(AuthContext);

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [selectedInternship, setSelectedInternship] = useState(null);

  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);

  // Fetch internships
  const fetchInternships = async () => {
    const res = await axios.get("http://localhost:8080/api/internships");
    setInternships(res.data);
  };

  // Fetch applications
  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:8080/api/applications");
    setApplications(res.data);
  };

  useEffect(() => {
    fetchInternships();
    fetchApplications();
  }, []);

  // Check if already applied
  const hasApplied = (internshipId) => {
    return applications.some(
      (app) => app.internshipId === internshipId && app.email === email
    );
  };

  // Apply function
  const handleApply = async () => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("internshipId", selectedInternship.id);
    formData.append("candidateName", candidateName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("degree", degree);
    formData.append("college", college);
    formData.append("cgpa", cgpa);
    formData.append("skills", skills);
    formData.append("resume", resume);

    try {
      await axios.post(
        "http://localhost:8080/api/applications/apply",
        formData
      );

      alert("Application submitted! Test is active for 2 days.");

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
        <div
          key={i.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <h3>{i.title}</h3>
          <p><strong>Location:</strong> {i.location}</p>
          <p><strong>CTC:</strong> {i.ctc}</p>
          <p><strong>Description:</strong> {i.description}</p>

          {hasApplied(i.id) ? (
            <button
              style={{
                padding: "6px 12px",
                background: "gray",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
              disabled
            >
              Applied
            </button>
          ) : (
            <button
              onClick={() => setSelectedInternship(i)}
              style={{
                padding: "6px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          )}
        </div>
      ))}

      {/* Apply Form */}
      {selectedInternship && (
        <div style={{ marginTop: "30px", padding: "20px", background: "#f4f4f4", borderRadius: "8px" }}>
          <h2>Apply for {selectedInternship.title}</h2>

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setCandidateName(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="text"
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="text"
            placeholder="Degree"
            onChange={(e) => setDegree(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="text"
            placeholder="College"
            onChange={(e) => setCollege(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="text"
            placeholder="CGPA"
            onChange={(e) => setCgpa(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="text"
            placeholder="Skills"
            onChange={(e) => setSkills(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <button
            onClick={handleApply}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Application
          </button>
        </div>
      )}

      <h2 style={{ marginTop: "40px" }}>My Applications</h2>

      {applications
        .filter((app) => app.email === email)
        .map((app) => (
          <div key={app.id} style={{ marginBottom: "15px" }}>
            <p><strong>Status:</strong> {app.status}</p>
            <p><strong>Test Active Until:</strong> {app.testDate}</p>
          </div>
        ))}
    </div>
  );
}

export default CandidateDashboard;
