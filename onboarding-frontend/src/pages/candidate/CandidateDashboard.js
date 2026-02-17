import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function CandidateDashboard() {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

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
  const [onboardingStatus, setOnboardingStatus] = useState(null);


 useEffect(() => {

  if (!user?.email) return;   // ⭐ WAIT until user.id exists

  fetchInternships();
  fetchApplications();
  fetchOnboarding();

  const interval = setInterval(() => {
    fetchApplications();
    fetchOnboarding();
  }, 5000);

  return () => clearInterval(interval);

}, [user?.email]);


const fetchOnboarding = async () => {

  if (!user?.email) return;

  try {
    const res = await axios.get(
      `http://localhost:8080/api/onboarding/candidate?email=${user.email}`
    );

    console.log("ONBOARDING DATA:", res.data);

   if (res.data.length > 0) {

  const latest = res.data[res.data.length - 1]; // get newest entry
  setOnboardingStatus(latest.status);

} else {
  setOnboardingStatus(null);
}

  } catch (err) {
    console.log(err);
  }
};



  const fetchInternships = async () => {
    const res = await axios.get("http://localhost:8080/api/internships");
    setInternships(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:8080/api/applications");

    const filtered = res.data.filter(
      (app) => app.email === user.email
    );

    setApplications(filtered);
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
    formData.append("email", user.email);
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Candidate Dashboard</h1>
          <p style={{ color: "gray", margin: 0 }}>{user?.email}</p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            padding: "8px 16px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <h2>Available Internships</h2>

      {internships.map((i) => (
        <div key={i.id} style={card}>

          <h3 style={{ textAlign: "center", color: "#111827" }}>
            {i.companyName}
          </h3>

          <p><b>Role:</b>{i.title}</p>
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

           
            <h3 style={{ textAlign: "center", color: "#111827" }}>
              {internship?.companyName}
            </h3>

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
              <p style={{ color: "#111827" }}>Online Test-Passed</p>}

            {app.status === "TEST_FAILED" &&
              <p style={{ color: "red", fontWeight: "bold" }}>
                 Online Test-Not Cleared
              </p>}

            {app.interviewStatus === "L1_SCHEDULED" && (
              <div style={interviewBox}>
                L1 Interview Scheduled <br />
                <b>Date:</b>{formatDate(app.l1Date)} <br />
                <b>Time:</b>{formatTime(app.l1Time)} <br />
                <b>Mode:</b>{app.l1Mode} <br />
                <b>Interviewer</b>{getInterviewerName(app.l1InterviewerId)}
              </div>
            )}

            {app.l1Result === "PASSED" &&
              <p style={{ color: "#111827" }}> L1 Interview-Cleared</p>}

            {app.interviewStatus === "L1_FAILED" &&
              <p style={{ color: "red", fontWeight: "bold" }}>
                 L1 Interview-Not Cleared
              </p>}

            {app.interviewStatus === "L2_SCHEDULED" && (
              <div style={interviewBox}>
                L2 Interview Scheduled <br />
                <b>Date:</b>{formatDate(app.l2Date)} <br />
                <b>Time:</b>{formatTime(app.l2Time)} <br />
                <b>Mode:</b>{app.l2Mode} <br />
                <b>Interviewer :</b>{getInterviewerName(app.l2InterviewerId)}<br />
              </div>
            )}

            {app.l2Result === "PASSED" &&
              <p style={{ color: "#111827" }}>L2 Interview-Cleared</p>}

            {app.interviewStatus === "L2_FAILED" &&
              <p style={{ color: "red", fontWeight: "bold" }}>
                 L2 Interview-Not Cleared
              </p>}

            {app.interviewStatus === "HR_SCHEDULED" && !app.hrResult && (
              <div style={interviewBox}>
                HR Interview Scheduled <br />
                <b>Date:</b>{formatDate(app.hrDate)} <br />
                <b>Time:</b>{formatTime(app.hrTime)} <br />
                <b>Mode:</b>{app.hrMode}
              </div>
            )}

            {app.hrResult === "PASSED" &&
              <p style={{ color: "#111827" }}>HR Round- Cleared</p>}

            {app.hrResult === "FAILED" &&
              <p style={{ color: "red", fontWeight: "bold" }}>
                HR Round-Not Cleared
              </p>}

             {app.offerStatus === "REJECTED" &&
              <p style={{ color: "red", fontWeight: "bold" }}>
                Offer-Declined
              </p>
            }

            {app.offerLetterFile && app.offerStatus !== "REJECTED" && (
              <div style={{marginTop:"10px"}}>
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

               {app.signedOfferLetter && (
  <>
    <p style={{ color: "black" }}>Offer Process-Completed</p>

    {!onboardingStatus && (
      <button
        onClick={() => navigate("/onboarding")}
        style={{
          marginTop: "10px",
          padding: "8px 14px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Fill Onboarding Form
      </button>
    )}

    {onboardingStatus === "PENDING" && (
      <p style={{ color: "orange", marginTop: "10px" }}>
        Onboarding submitted – waiting for HR verification
      </p>
    )}

    {onboardingStatus === "VERIFIED" && (
      <p style={{ color: "green", marginTop: "10px" }}>
        Onboarding verified ✅
      </p>
    )}

    {onboardingStatus === "REJECTED" && (
      <p style={{ color: "red", marginTop: "10px" }}>
        Onboarding rejected ❌
      </p>
    )}
  </>
)}


              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default CandidateDashboard;

const card = {
  border: "1px solid #e5e7eb",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
  background: "#ffffff",
  color: "#111827"
};

const applyBtn = {
  padding: "6px 12px",
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const appliedBtn = {
  padding: "6px 12px",
  background: "#e5e7eb",
  color: "#374151",
  border: "none",
  borderRadius: 6
};

const submitBtn = {
  marginTop: 15,
  padding: "10px 20px",
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const input = {
  width: "100%",
  marginBottom: 10,
  padding: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  color: "#111827"
};

const formBox = {
  marginTop: 30,
  padding: 20,
  background: "#ffffff",
  borderRadius: 10,
  border: "1px solid #e5e7eb"
};

const testBtn = {
  padding: "8px 15px",
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer"
};

const interviewBox = {
  marginTop: "10px",
  padding: "12px",
  background: "white",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  color: "#111827",
  fontWeight: 500
};
