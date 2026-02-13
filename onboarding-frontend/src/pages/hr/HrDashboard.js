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

 

  const handlePdfUpload = async () => {

    if (!pdfFile) return alert("Please select a PDF");

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

    } catch {
      alert("PDF upload failed");
    }
  };

  

  const handlePost = async () => {

    if (!pdfUploaded) return alert("Upload PDF first");

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
      fileInputRef.current.value = "";

      alert("Internship posted successfully!");

    } catch {
      alert("Posting failed");
    }
  };

  

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/internships/${id}`);
    setInternships(internships.filter((i) => i.id !== id));
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

  

  const scheduleInterview = async (appId) => {

    const data = scheduleData[appId];

    if (!data?.date || !data?.time) {
      return alert("Select date & time");
    }

    try {
      await axios.post(
        "http://localhost:8080/api/applications/schedule-interview",
        null,
        {
          params: {
            applicationId: appId,
            level: "L1",
            date: data.date,
            time: data.time
          }
        }
      );

      alert("Interview Scheduled ");
      fetchApplications();

    } catch (err) {
      console.error(err);
      alert("Scheduling failed");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <h1>HR Dashboard</h1>

     

      <div style={box}>

        <h2>Post New Internship</h2>

        <input placeholder="Internship Title" value={title}
          onChange={(e) => setTitle(e.target.value)} style={input}/>

        <input placeholder="Location" value={location}
          onChange={(e) => setLocation(e.target.value)} style={input}/>

        <input placeholder="CTC" value={ctc}
          onChange={(e) => setCtc(e.target.value)} style={input}/>

        <textarea placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)} style={input}/>

        <hr/>

        <h3>Upload Company PDF</h3>

        <input type="file" accept="application/pdf"
          ref={fileInputRef}
          onChange={(e) => setPdfFile(e.target.files[0])} />

        <br/><br/>

        <button onClick={handlePdfUpload} style={btnGreen}>Upload PDF</button>

        {pdfUploaded && (
          <button onClick={handlePost} style={btnBlue}>
            Post Internship
          </button>
        )}

      </div>

      

      <h2>Posted Internships</h2>

      {internships.map((i) => (
        <div key={i.id} style={card}>
          <h3>{i.title}</h3>
          <p><b>Location:</b> {i.location}</p>
          <p><b>CTC:</b> {i.ctc}</p>
          <p><b>Description:</b> {i.description}</p>

          <button onClick={() => handleDelete(i.id)} style={btnRed}>
            Delete
          </button>
        </div>
      ))}

      

      <h2>Cleared Candidates (Test Passed)</h2>

      {applications
        .filter((app) => app.status === "TEST_PASSED")
        .map((app) => (

          <div key={app.id} style={card}>

            <h3>{app.candidateName}</h3>
            <p><b>Email:</b> {app.email}</p>
            <p><b>Phone:</b> {app.phone}</p>
            <p><b>Score:</b> {app.score}/15</p>

            {app.interviewStatus === "L1_SCHEDULED" ? (

              <p style={{ color: "green", fontWeight: "bold" }}>
                L1 Scheduled on {app.interviewDate} at {app.interviewTime}
              </p>

            ) : (

              <>
                <input type="date"
                  onChange={(e) =>
                    handleInputChange(app.id, "date", e.target.value)
                  } />

                <input type="time"
                  onChange={(e) =>
                    handleInputChange(app.id, "time", e.target.value)
                  }
                  style={{ marginLeft: 10 }}
                />

                <button
                  onClick={() => scheduleInterview(app.id)}
                  style={btnGreen}
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

const box = { background:"#f4f4f4", padding:20, borderRadius:8, marginBottom:30 };
const card = { border:"1px solid #ccc", padding:20, borderRadius:10, marginBottom:20, background:"#f9f9f9" };
const input = { width:"100%", padding:8, marginBottom:10 };

const btnGreen = { background:"green", color:"white", border:"none", padding:"8px 15px", borderRadius:5, marginRight:10 };
const btnBlue = { background:"#007bff", color:"white", border:"none", padding:"8px 15px", borderRadius:5 };
const btnRed = { background:"red", color:"white", border:"none", padding:"6px 12px", borderRadius:4 };
