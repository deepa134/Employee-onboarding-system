import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AppliedInternships() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/applications")
      .then(res => {
        setApplications(res.data.filter(a => a.email === user.email));
      });
  }, []);

  return (
    <div className="page">

      <h2>My Applications</h2>

      {applications.map(app => (
        <div key={app.id} className="card">

          <h3>{app.candidateName}</h3>

          <button onClick={() => navigate(`/candidate/application/${app.id}`)}>
            Access
          </button>

        </div>
      ))}

    </div>
  );
}

export default AppliedInternships;
