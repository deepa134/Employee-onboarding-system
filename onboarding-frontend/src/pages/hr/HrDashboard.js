import { useState, useEffect, useRef } from "react";
import axios from "axios";

function HrDashboard() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [ctc, setCtc] = useState("");
  const [description, setDescription] = useState("");
  const [internships, setInternships] = useState([]);

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

  useEffect(() => {
    fetchInternships();
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

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>HR Dashboard</h1>

      <div
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2>Post New Internship</h2>

        <input
          type="text"
          placeholder="Internship Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="CTC (per annum)"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <hr style={{ margin: "25px 0" }} />

        <h2>Upload Company PDF</h2>

        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={(e) => setPdfFile(e.target.files[0])}
        />

        <button
          onClick={handlePdfUpload}
          style={{
            marginTop: "10px",
            padding: "8px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload PDF
        </button>

        {pdfUploaded && (
          <p style={{ color: "green", marginTop: "10px" }}>
            PDF Uploaded Successfully
          </p>
        )}

        {pdfUploaded && (
          <button
            onClick={handlePost}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Post Internship
          </button>
        )}
      </div>

      <h2>Posted Internships</h2>

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
          <p><strong>Status:</strong> {i.status}</p>
          <p><strong>PDF:</strong> {i.pdfFileName}</p>

          <button
            onClick={() => handleDelete(i.id)}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default HrDashboard;
