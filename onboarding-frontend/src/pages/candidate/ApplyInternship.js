import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./CandidateDashboard.css";

function ApplyInternship() {

  const { user } = useContext(AuthContext);

  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [candidateName, setCandidateName] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/internships")
      .then(res => setInternships(res.data));
  }, []);

  const handleApply = async () => {

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

    alert("Applied Successfully");
    setSelectedInternship(null);
  };

  return (
    <div className="page">

      <h2>Available Internships</h2>

      <div className="grid">
        {internships.map(i => (
          <div key={i.id} className="internshipCard">

            <h3>{i.companyName}</h3>
            <p>{i.title}</p>
            <p>{i.ctc}</p>

            <button onClick={() => setSelectedInternship(i)}>Apply</button>

          </div>
        ))}
      </div>

      {selectedInternship && (
        <div className="formBox">

          <input placeholder="Name" onChange={(e) => setCandidateName(e.target.value)} />
          <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Degree" onChange={(e) => setDegree(e.target.value)} />
          <input placeholder="College" onChange={(e) => setCollege(e.target.value)} />
          <input placeholder="CGPA" onChange={(e) => setCgpa(e.target.value)} />
          <input placeholder="Skills" onChange={(e) => setSkills(e.target.value)} />
          <input type="file" onChange={(e) => setResume(e.target.files[0])} />

          <button onClick={handleApply}>Submit</button>

        </div>
      )}

    </div>
  );
}

export default ApplyInternship;
