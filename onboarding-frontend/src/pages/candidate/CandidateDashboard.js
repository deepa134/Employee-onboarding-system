import { useEffect, useState } from "react";
import axios from "axios";

function CandidateDashboard() {
  const [internships, setInternships] = useState([]);
  const [tests, setTests] = useState([]);
  const candidateId = 1; 

 
  useEffect(() => {
    axios.get("http://localhost:8080/api/internships")
      .then(res => setInternships(res.data))
      .catch(err => console.error(err));
  }, []);

  
  useEffect(() => {
    axios.get(`http://localhost:8080/api/candidates/${candidateId}/tests`)
      .then(res => setTests(res.data))
      .catch(err => console.error(err));
  }, []);

  
  const applyForInternship = (internshipId) => {
    axios.post(`http://localhost:8080/api/applications`, {
      candidateId,
      internshipId
    })
    .then(res => alert("Applied successfully! First online test scheduled."))
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Candidate Dashboard</h1>

      <h2>Available Internships</h2>
      <ul>
        {internships.map(i => (
          <li key={i.id}>
            {i.title} ({i.status}) 
            {i.status === "OPEN" && <button onClick={() => applyForInternship(i.id)}>Apply</button>}
          </li>
        ))}
      </ul>

      <h2>My Tests</h2>
      <ul>
        {tests.map(t => (
          <li key={t.id}>
            {t.testType} - Status: {t.testStatus} - Score: {t.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CandidateDashboard;
