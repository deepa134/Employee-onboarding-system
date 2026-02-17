import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function HrDashboard() {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [ctc, setCtc] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerFiles, setOfferFiles] = useState({});

  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [onboardingList, setOnboardingList] = useState([]);


  const fileInputRef = useRef(null);

  useEffect(() => {

    if (!user || user.role !== "HR") {
      navigate("/");
      return;
    }

    fetchInternships();
    fetchApplications();
    fetchOnboarding();


    const interval = setInterval(() => {
      fetchInternships();
      fetchApplications();
      fetchOnboarding();

    }, 5000);

    return () => clearInterval(interval);

  }, [user, navigate]);

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

  const getInterviewerName = (id) =>
    id === 1 ? "Kavya" : id === 2 ? "Arun" : id === 3 ? "Divya" : "";
  const fetchOnboarding = async () => {
  const res = await axios.get("http://localhost:8080/api/onboarding");
  setOnboardingList(res.data);
};


  const fetchInternships = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/internships");
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOfferFileChange = (id, file) => {
    setOfferFiles({ ...offerFiles, [id]: file });
  };

  const uploadOfferLetter = async (id) => {
    const file = offerFiles[id];
    if (!file) return alert("Select offer letter");

    const formData = new FormData();
    formData.append("applicationId", id);
    formData.append("file", file);

    await axios.post(
      "http://localhost:8080/api/applications/upload-offer-letter",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    fetchApplications();
  };
  const updateOnboardingStatus = async (id, status) => {

  await axios.put(
    `http://localhost:8080/api/onboarding/update/${id}/${status}`
  );

  fetchOnboarding();
};


  const handlePdfUpload = async () => {
    if (!pdfFile) return alert("Select PDF");

    const formData = new FormData();
    formData.append("file", pdfFile);

    const res = await axios.post(
      "http://localhost:8080/api/internships/upload-pdf",
      formData
    );
    

    setUploadedFileName(res.data);
    setPdfUploaded(true);
  };

  const handlePost = async () => {
    if (!pdfUploaded) return alert("Upload PDF first");

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("title", title);
    formData.append("location", location);
    formData.append("ctc", ctc);
    formData.append("description", description);
    formData.append("pdfFileName", uploadedFileName);

    await axios.post(
      "http://localhost:8080/api/internships/post",
      formData
    );

    setCompanyName("");
    setTitle("");
    setLocation("");
    setCtc("");
    setDescription("");
    setPdfUploaded(false);
    setPdfFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fetchInternships();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/internships/${id}`);
    fetchInternships();
  };

  const handleInputChange = (appId, field, value) => {
    setScheduleData({
      ...scheduleData,
      [appId]: {
        ...scheduleData[appId],
        [field]: value
      }
    });
  };

  const scheduleInterview = async (appId, level) => {
    const data = scheduleData[appId];

    if (!data?.date || !data?.time || !data?.mode) {
      return alert("Fill all fields");
    }

    await axios.post(
      "http://localhost:8080/api/applications/schedule-interview",
      null,
      {
        params: {
          applicationId: appId,
          level,
          date: data.date,
          time: data.time,
          mode: data.mode,
          interviewerId:
            level === "HR" ? null : Number(data.interviewerId)
        }
      }
    );

    fetchApplications();
  };

  const updateHrResult = async (id, result) => {
    await axios.post(
      "http://localhost:8080/api/applications/hr-result",
      null,
      { params: { applicationId: id, result } }
    );
    fetchApplications();
  };



  return (
    <div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>HR Dashboard</h1>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            padding: "8px 16px",
            background: "black",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

     <div
  style={{
    border: "1px solid black",
    padding: "20px",
    marginBottom: "25px",
    maxWidth: "600px"
  }}
>
  <h2 style={{ marginBottom: "15px" }}>Post New Internship</h2>

  <input
    style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid black" }}
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <input
    style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid black" }}
    placeholder="Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />

  <input
    style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid black" }}
    placeholder="CTC"
    value={ctc}
    onChange={(e) => setCtc(e.target.value)}
  />

  <input
    style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid black" }}
    placeholder="Company Name"
    value={companyName}
    onChange={(e) => setCompanyName(e.target.value)}
  />
  <textarea
    style={{ width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid black" }}
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
  <input
    type="file"
    ref={fileInputRef}
    onChange={(e) => setPdfFile(e.target.files[0])}
    style={{ marginBottom: "10px" }}
  />
  <button
    onClick={handlePdfUpload}
    style={{
      background: "black",
      color: "white",
      padding: "8px 16px",
      border: "none",
      marginRight: "10px",
      cursor: "pointer"
    }}
  >
    Upload PDF
  </button>
  {pdfUploaded && (
    <button
      onClick={handlePost}
      style={{
        background: "black",
        color: "white",
        padding: "8px 16px",
        border: "none",
        cursor: "pointer"
      }}
    >
      Post Internship
    </button>
  )}
</div>
      <hr />

      <h2>Posted Internships</h2>

      {internships.map((i) => (
        <div key={i.id}>
          <h3>{i.title}</h3>
          <p><b>Company:</b> {i.companyName}</p>
          <p><b>Place:</b> {i.location}</p>
          <p><b>CTC:</b> {i.ctc}</p>
          <p><b>Description:</b> {i.description}</p>
          <button onClick={() => handleDelete(i.id)}>Delete</button>
        </div>
      ))}
      <hr />

      <h2>Candidates</h2>

      {applications.map((app) => {

      const showSchedule =
  (app.status === "TEST_PASSED" && app.interviewStatus !== "L1_SCHEDULED") ||
  (app.status === "L2_PENDING" && app.interviewStatus !== "L2_SCHEDULED") ||
  (app.status === "HR_PENDING" && app.interviewStatus !== "HR_SCHEDULED") ||
  app.l1InterviewerStatus === "REJECTED" ||
  app.l2InterviewerStatus === "REJECTED";
        return (
          <div key={app.id}>

            <h3>{app.candidateName}</h3>

            <button onClick={() => setSelectedCandidate(app)}>View Details</button>

            <div style={{ paddingLeft: "15px" }}>

              <p>Test Cleared</p>

              {app.interviewStatus === "L1_SCHEDULED" && app.l1InterviewerStatus === "REQUESTED" &&
                <p>L1 scheduled – waiting for interviewer response</p>}

              {app.interviewStatus === "L2_SCHEDULED" && app.l2InterviewerStatus === "REQUESTED" &&
                <p>L2 scheduled – waiting for interviewer response</p>}

              {app.interviewStatus === "HR_SCHEDULED" && !app.hrResult &&
                <p>HR – {formatDate(app.hrDate)} | {formatTime(app.hrTime)} | {app.hrMode}</p>}

              {app.l1Date &&
                <p>L1 – {formatDate(app.l1Date)} | {getInterviewerName(app.l1InterviewerId)} | {app.l1Mode}</p>}
              {app.l1InterviewerStatus === "REJECTED" && (
  <p style={{ color: "red", fontWeight: "bold" }}>
    L1 interviewer rejected — please reschedule
  </p>
)}
{app.l2InterviewerStatus === "REJECTED" && (
  <p style={{ color: "red", fontWeight: "bold" }}>
    L2 interviewer rejected — please reschedule
  </p>
)}
              {app.interviewStatus === "L1_FAILED" &&
                <p style={{ color: "red", fontWeight: "bold" }}>Candidate failed to clear L1</p>}

              {app.l2Date &&
                <p>L2 – {formatDate(app.l2Date)} | {getInterviewerName(app.l2InterviewerId)} | {app.l2Mode}</p>}

              {app.interviewStatus === "L2_FAILED" &&
                <p style={{ color: "red", fontWeight: "bold" }}>Candidate failed to clear L2</p>}

              {app.hrDate &&
                <p>HR – {formatDate(app.hrDate)} | HR | {app.hrMode}</p>}

              {app.interviewStatus === "HR_FAILED" &&
                <p style={{ color: "red", fontWeight: "bold" }}>Candidate failed in HR round</p>}

              {app.status === "SELECTED" &&
                <p style={{ color: "black", fontWeight: "bold" }}>
                  Candidate cleared all rounds successfully
                </p>}
{app.offerLetterFile && (
  <p style={{ color: "black", fontWeight: "bold" }}>
     Offer Letter-- Sent
  </p>
)}
              
              {app.signedOfferLetter && (
  <p style={{ color: "#16a34a", fontWeight: 600 }}>
    Offer Process — Completed
  </p>
)}

{app.signedOfferLetter && (
  <div>
    <a
      href={`http://localhost:8080/signed-offers/${app.signedOfferLetter}`}
      target="_blank"
      rel="noreferrer"
    >
      View Signed Offer Letter
    </a>
  </div>
)}



{app.signedOfferLetter && (() => {

  const record = onboardingList
    .filter(ob => ob.email === app.email)
    .slice(-1)[0];

  if (!record) {
    return (
      <p style={{ color: "orange", fontWeight: 600 }}>
        Waiting for candidate to submit onboarding
      </p>
    );
  }

  if (record.status === "PENDING") {
    return (
      <div style={{ marginTop: "10px" }}>
        <p style={{ fontWeight: 600 }}>Onboarding Details</p>

        <p><b>Address:</b> {record.address}</p>
        <p><b>Aadhaar:</b> {record.aadhaar}</p>
        <p><b>PAN:</b> {record.pan}</p>
        <p><b>Bank:</b> {record.bankAccount}</p>

        <button
          onClick={() => updateOnboardingStatus(record.id, "VERIFIED")}
          style={{ marginRight: "10px" }}
        >
          Verify
        </button>

        <button
          onClick={() => updateOnboardingStatus(record.id, "REJECTED")}
        >
          Reject
        </button>
      </div>
    );
  }

  if (record.status === "VERIFIED") {
    return (
      <p style={{ color: "green", fontWeight: 600 }}>
        Onboarding Completed ✅
      </p>
    );
  }

  if (record.status === "REJECTED") {
    return (
      <p style={{ color: "red", fontWeight: 600 }}>
        Waiting for candidate to resubmit onboarding
      </p>
    );
  }

})()}


            </div>
            {app.interviewStatus === "HR_SCHEDULED" &&
              app.status !== "SELECTED" &&
              app.status !== "REJECTED" && (
                <>
                  <button onClick={() => updateHrResult(app.id, "HR_PASSED")}>Select</button>
                  <button onClick={() => updateHrResult(app.id, "HR_FAILED")}>Reject</button>
                </>
              )}

            {app.status === "SELECTED" && !app.offerLetterFile && (
              <>
                <input type="file"
                  onChange={(e) => handleOfferFileChange(app.id, e.target.files[0])}
                />
                <button onClick={() => uploadOfferLetter(app.id)}>
                  Upload Offer Letter
                </button>
              </>
            )}
          

            {showSchedule && (
              <>
                <input type="date" onChange={(e) => handleInputChange(app.id, "date", e.target.value)} />
                <input type="time" onChange={(e) => handleInputChange(app.id, "time", e.target.value)} />

                <select onChange={(e) => handleInputChange(app.id, "mode", e.target.value)}>
                  <option value="">Mode</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </select>

                {app.status !== "HR_PENDING" && (
                  <select onChange={(e) => handleInputChange(app.id, "interviewerId", e.target.value)}>
                    <option value="">Interviewer</option>
                    <option value="1">Kavya</option>
                    <option value="2">Arun</option>
                    <option value="3">Divya</option>
                  </select>
                )}

               <button
  onClick={() =>
    scheduleInterview(
      app.id,
      app.status === "TEST_PASSED"
        ? "L1"
        : app.status === "L2_PENDING"
        ? "L2"
        : "HR"
    )
  }
>
  {app.status === "TEST_PASSED"
    ? "Schedule L1"
    : app.status === "L2_PENDING"
    ? "Schedule L2"
    : "Schedule HR"}
</button>

              </>
            )}

            <hr />

          </div>
        );
      })}

      {selectedCandidate && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          width: "350px",
          background: "#fff",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px"
        }}>
          <h3>Candidate Details</h3>

          <p><b>Name:</b> {selectedCandidate.candidateName}</p>
          <p><b>Email:</b> {selectedCandidate.email}</p>
          <p><b>Phone:</b> {selectedCandidate.phone}</p>
          <p><b>Degree:</b> {selectedCandidate.degree}</p>
          <p><b>College:</b> {selectedCandidate.college}</p>
          <p><b>CGPA:</b> {selectedCandidate.cgpa}</p>
          <p><b>Skills:</b> {selectedCandidate.skills}</p>

          <a
            href={`http://localhost:8080/resumes/${selectedCandidate.resumeFileName}`}
            target="_blank"
            rel="noreferrer"
          >
            Download Resume
          </a>

          <br /><br />

          <button onClick={() => setSelectedCandidate(null)}>Close</button>

        </div>
      )}

    </div>
  );
}

export default HrDashboard;
