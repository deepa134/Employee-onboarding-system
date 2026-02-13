import { useState, useEffect, useRef } from "react";
import axios from "axios";

function HrDashboard() {

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [ctc, setCtc] = useState("");
  const [description, setDescription] = useState("");

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [scheduleData, setScheduleData] = useState({});

  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [pdfUploaded, setPdfUploaded] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchInternships();
    fetchApplications();
  }, []);

  const fetchInternships = async () => {
    const res = await axios.get("http://localhost:8080/api/internships");
    setInternships(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:8080/api/applications");
    setApplications(res.data);
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

  // ================= PDF UPLOAD =================

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
    alert("PDF uploaded");
  };

  // ================= POST INTERNSHIP =================

  const handlePost = async () => {

    if (!pdfUploaded) return alert("Upload PDF first");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("ctc", ctc);
    formData.append("description", description);
    formData.append("pdfFileName", uploadedFileName);

    await axios.post(
      "http://localhost:8080/api/internships/post",
      formData
    );

    alert("Internship posted");

    setTitle("");
    setLocation("");
    setCtc("");
    setDescription("");
    setPdfUploaded(false);
    setPdfFile(null);
    fileInputRef.current.value = "";

    fetchInternships();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/internships/${id}`);
    fetchInternships();
  };

  // ================= SCHEDULE INTERVIEW =================

  const scheduleInterview = async (appId, level) => {

    const data = scheduleData[appId];

    if (!data?.date || !data?.time || !data?.mode || !data?.interviewerId) {
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
          time: data.time?.slice(0, 5),
          mode: data.mode,
          interviewerId: data.interviewerId
        }
      }
    );

    alert(`${level} Scheduled`);
    fetchApplications();
  };

  return (
    <div>

      <h1>HR Dashboard</h1>

      {/* ================= POST INTERNSHIP ================= */}

      <h2>Post New Internship</h2>

      <input placeholder="Title" value={title}
        onChange={(e) => setTitle(e.target.value)} />

      <input placeholder="Location" value={location}
        onChange={(e) => setLocation(e.target.value)} />

      <input placeholder="CTC" value={ctc}
        onChange={(e) => setCtc(e.target.value)} />

      <textarea placeholder="Description" value={description}
        onChange={(e) => setDescription(e.target.value)} />

      <br /><br />

      <input type="file" ref={fileInputRef}
        onChange={(e) => setPdfFile(e.target.files[0])} />

      <button onClick={handlePdfUpload}>Upload PDF</button>

      {pdfUploaded && <button onClick={handlePost}>Post Internship</button>}

      <hr />

      {/* ================= POSTED INTERNSHIPS ================= */}

      <h2>Posted Internships</h2>

      {internships.map((i) => (
        <div key={i.id}>
          <h3>{i.title}</h3>

          <p><b>Location:</b> {i.location}</p>
          <p><b>CTC:</b> {i.ctc}</p>
          <p><b>Description:</b> {i.description}</p>

          <button onClick={() => handleDelete(i.id)}>Delete</button>
        </div>
      ))}

      <hr />

      {/* ================= CANDIDATES ================= */}

      <h2>Candidates</h2>

      {applications
        .filter((app) =>
          app.status === "TEST_PASSED" || app.status === "L2_PENDING"
        )
        .map((app) => (

          <div key={app.id}>

            <h3>{app.candidateName}</h3>
            <p>{app.email}</p>

            {app.interviewStatus === "L1_SCHEDULED" && (
              <p>
                L1 on {app.interviewDate} at {app.interviewTime}
              </p>
            )}

            {app.status === "L2_PENDING" && (
              <p>L1 Cleared → Schedule L2</p>
            )}

            {(app.interviewStatus !== "L1_SCHEDULED" ||
              app.status === "L2_PENDING") && (

              <>
                <input
                  type="date"
                  onChange={(e) =>
                    handleInputChange(app.id, "date", e.target.value)
                  }
                />

                <input
                  type="time"
                  step="60"
                  onChange={(e) =>
                    handleInputChange(app.id, "time", e.target.value)
                  }
                />

                <br /><br />

                <select
                  onChange={(e) =>
                    handleInputChange(app.id, "mode", e.target.value)
                  }
                >
                  <option value="">Mode</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </select>

                <br /><br />

                <select
                  onChange={(e) =>
                    handleInputChange(app.id, "interviewerId", e.target.value)
                  }
                >
                  <option value="">Interviewer</option>
                  <option value="1">Kavya</option>
                  <option value="2">Arun</option>
                  <option value="3">Divya</option>
                </select>

                <br /><br />

                <button
                  onClick={() =>
                    scheduleInterview(
                      app.id,
                      app.status === "L2_PENDING" ? "L2" : "L1"
                    )
                  }
                >
                  Schedule {app.status === "L2_PENDING" ? "L2" : "L1"}
                </button>
              </>
            )}

            <hr />

          </div>
        ))}

    </div>
  );
}

export default HrDashboard;
