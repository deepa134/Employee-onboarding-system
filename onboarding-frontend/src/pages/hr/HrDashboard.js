import { useState, useEffect, useRef } from "react";
import axios from "axios";

function HrDashboard() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [ctc, setCtc] = useState("");
  const [description, setDescription] = useState("");
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [pdfUploaded, setPdfUploaded] = useState(false);

  const fileInputRef = useRef(null);

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

  useEffect(() => {
    fetchInternships();
    fetchApplications();
  }, []);

  const handlePdfUpload = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/internships/upload-pdf",
        formData
      );

      setUploadedFileName(res.data);
      setPdfUploaded(true);
      alert("PDF uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("PDF upload failed");
    }
  };

  const handlePost = async () => {
    if (!pdfUploaded) {
      alert("Please upload PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("ctc", ctc);
    formData.append("description", description);
    formData.append("pdfFileName", uploadedFileName);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/internships/post",
        formData
      );

      setInternships([...internships, res.data]);

      setTitle("");
      setLocation("");
      setCtc("");
      setDescription("");

      setPdfUploaded(false);
      setUploadedFileName("");
      setPdfFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Internship posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Posting failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/internships/${id}`);
      setInternships(internships.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const scheduleInterview = async (appId, date, time) => {
    try {
      await axios.post(
        "http://localhost:8080/api/applications/schedule-interview",
        null,
        {
          params: {
            applicationId: appId,
            date: date,
            time: time,
          },
        }
      );

      alert("Interview Scheduled Successfully!");
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Scheduling failed");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>HR Dashboard</h1>

      {/* =================== INTERNSHIP POSTING =================== */}

      <div
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2>Post New Internship</h2>

        <input type="text" placeholder="Internship Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        <input type="text" placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        <input type="text" placeholder="CTC (per annum)"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        <textarea placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        <hr style={{ margin: "25px 0" }} />

        <h2>Upload Company PDF</h2>

        <input type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={(e) => setPdfFile(e.target.files[0])} />

        <button onClick={handlePdfUpload}
          style={{
            marginTop: "10px",
            padding: "8px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          Upload PDF
        </button>

        {pdfUploaded && (
          <button onClick={handlePost}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}>
            Post Internship
          </button>
        )}
      </div>

      {/* =================== CLEARED CANDIDATES =================== */}

      <h2>Cleared Candidates (Test Passed)</h2>

      {applications
        .filter((app) => app.status === "TEST_PASSED")
        .map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              background: "#f9f9f9",
            }}
          >
            <h3>{app.candidateName}</h3>
            <p><strong>Email:</strong> {app.email}</p>
            <p><strong>Phone:</strong> {app.phone}</p>
            <p><strong>Score:</strong> {app.score} / 15</p>

            {app.interviewStatus === "L1_SCHEDULED" ? (
              <p style={{ color: "green" }}>
                L1 Scheduled on {app.interviewDate} at {app.interviewTime}
              </p>
            ) : (
              <>
                <input
                  type="date"
                  onChange={(e) => app.tempDate = e.target.value}
                />
                <input
                  type="time"
                  onChange={(e) => app.tempTime = e.target.value}
                  style={{ marginLeft: "10px" }}
                />
                <button
                  onClick={() =>
                    scheduleInterview(app.id, app.tempDate, app.tempTime)
                  }
                  style={{
                    marginLeft: "10px",
                    background: "green",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                  }}
                >
                  Schedule L1
                </button>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default HrDashboard;
