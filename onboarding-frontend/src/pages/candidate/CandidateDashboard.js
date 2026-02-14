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

  const [signedFiles, setSignedFiles] = useState({});

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

  const getInterviewerName = (id) => {
    if (id === 1) return "Kavya";
    if (id === 2) return "Arun";
    if (id === 3) return "Divya";
    return "";
  };

  const hasApplied = (internshipId) =>
    applications.some((app) => app.internshipId === internshipId);

  const handleApply = async () => {

    if (!resume) return alert("Please upload resume");

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

    await axios.post("http://localhost:8080/api/applications/apply", formData);

    alert("Application submitted!");

    setSelectedInternship(null);
    setCandidateName("");
    setPhone("");
    setDegree("");
    setCollege("");
    setCgpa("");
    setSkills("");
    setResume(null);

    fetchApplications();
  };

  const updateOfferStatus = async (id, status) => {
    await axios.post(
      "http://localhost:8080/api/applications/offer-status",
      null,
      { params: { applicationId: id, status } }
    );
    fetchApplications();
  };

  const handleSignedFileChange = (id, file) => {
    setSignedFiles({ ...signedFiles, [id]: file });
  };

  const uploadSignedOffer = async (id) => {

    const file = signedFiles[id];
    if (!file) return alert("Upload signed offer");

    const formData = new FormData();
    formData.append("applicationId", id);
    formData.append("file", file);

    await axios.post(
      "http://localhost:8080/api/applications/upload-signed-offer",
      formData
    );

    alert("Signed offer uploaded");

    setSignedFiles({ ...signedFiles, [id]: null });

    fetchApplications();
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

          <input placeholder="Full Name" value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)} style={input} />

          <input placeholder="Phone" value={phone}
            onChange={(e) => setPhone(e.target.value)} style={input} />

          <input placeholder="Degree" value={degree}
            onChange={(e) => setDegree(e.target.value)} style={input} />

          <input placeholder="College" value={college}
            onChange={(e) => setCollege(e.target.value)} style={input} />

          <input placeholder="CGPA" value={cgpa}
            onChange={(e) => setCgpa(e.target.value)} style={input} />

          <input placeholder="Skills" value={skills}
            onChange={(e) => setSkills(e.target.value)} style={input} />

          <input type="file" accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])} />

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

            {app.status === "TEST_ACTIVE" && (
              <>
                <p>Test active till {formatDate(app.testDate)}</p>
                <button
                  onClick={() => navigate(`/candidate/test/${app.id}`)}
                  style={testBtn}
                >
                  Take Test
                </button>
              </>
            )}

            {app.status === "TEST_PASSED" &&
              <p style={{ color: "green" }}>You cleared the online test</p>}

            {app.interviewStatus === "L1_SCHEDULED" && (
              <div style={interviewBox}>
                L1 Interview Scheduled <br />
                {formatDate(app.l1Date)} <br />
                {formatTime(app.l1Time)} <br />
                {app.l1Mode} <br />
                {getInterviewerName(app.l1InterviewerId)}
              </div>
            )}

            {app.l1Result === "PASSED" && <p style={{ color: "green" }}>You cleared L1</p>}

            {app.interviewStatus === "L2_SCHEDULED" && (
              <div style={interviewBox}>
                L2 Interview Scheduled <br />
                {formatDate(app.l2Date)} <br />
                {formatTime(app.l2Time)} <br />
                {app.l2Mode} <br />
                {getInterviewerName(app.l2InterviewerId)}
              </div>
            )}

            {app.l2Result === "PASSED" && <p style={{ color: "green" }}>You cleared L2</p>}

            {app.interviewStatus === "HR_SCHEDULED" && !app.hrResult && (
              <div style={interviewBox}>
                HR Interview Scheduled <br />
                {formatDate(app.hrDate)} <br />
                {formatTime(app.hrTime)} <br />
                {app.hrMode}
              </div>
            )}

            {app.hrResult === "PASSED" &&
              <p style={{ color: "green", fontWeight: "bold" }}>HR round cleared</p>}

            {app.hrResult === "FAILED" &&
              <p style={{ color: "red", fontWeight: "bold" }}>HR round not cleared</p>}

            {app.offerLetterFile && (
              <div style={interviewBox}>

                <a
                  href={`http://localhost:8080/offers/${app.offerLetterFile}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Offer Letter
                </a>

                {app.offerStatus === "PENDING" && (
                  <>
                    <br /><br />
                    <button onClick={() => updateOfferStatus(app.id, "ACCEPTED")}>Accept</button>
                    <button onClick={() => updateOfferStatus(app.id, "REJECTED")}>Reject</button>
                  </>
                )}

                {app.offerStatus === "ACCEPTED" && !app.signedOfferLetter && (
                  <>
                    <br /><br />
                    <input
                      type="file"
                      onChange={(e) => handleSignedFileChange(app.id, e.target.files[0])}
                    />
                    <button onClick={() => uploadSignedOffer(app.id)}>
                      Upload Signed Offer
                    </button>
                  </>
                )}

                {app.signedOfferLetter &&
                  <p style={{ color: "green" }}>Offer accepted & signed</p>}
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default CandidateDashboard;

const card = { border: "1px solid #ccc", padding: 20, borderRadius: 10, marginBottom: 20, background: "#f9f9f9" };
const applyBtn = { padding: "6px 12px", background: "#007bff", color: "#fff", border: "none", borderRadius: 4 };
const appliedBtn = { padding: "6px 12px", background: "gray", color: "#fff", border: "none", borderRadius: 4 };
const submitBtn = { marginTop: 15, padding: "10px 20px", background: "green", color: "#fff", border: "none", borderRadius: 5 };
const input = { width: "100%", marginBottom: 10, padding: 8 };
const formBox = { marginTop: 30, padding: 20, background: "#f4f4f4", borderRadius: 8 };
const testBtn = { padding: "8px 15px", background: "orange", color: "#fff", border: "none", borderRadius: 5, marginTop: 10 };
const interviewBox = { marginTop: "10px", padding: "12px", background: "#e8f5e9", borderRadius: "8px", color: "green", fontWeight: "bold" };
