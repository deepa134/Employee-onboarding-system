import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function HrOnboardingDetails() {

  const { email } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/onboarding/candidate?email=${email}`
    );

    const latest = res.data[res.data.length - 1];
    setRecord(latest);
  };

 
  const updateStatus = async (status) => {

    await axios.put(
      `http://localhost:8080/api/onboarding/update/${record.id}/${status}`
    );

    fetchData(); 
  };

  if (!record) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "30px" }}>

      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Onboarding Details</h2>

   

      <p>
        <b>Status:</b>{" "}
        <span
          style={{
            fontWeight: 600,
            color:
              record.status === "VERIFIED"
                ? "green"
                : record.status === "REJECTED"
                ? "red"
                : "red"
          }}
        >
          {record.status}
        </span>
      </p>

      <hr />

      <p><b>Email:</b> {record.email}</p>
      <p><b>Address:</b> {record.address}</p>
      <p><b>Aadhaar:</b> {record.aadhaar}</p>
      <p><b>PAN:</b> {record.pan}</p>
      <p><b>Bank Account:</b> {record.bankAccount}</p>

      <br />

   

      {record.status === "PENDING" && (
        <>
          <button
            onClick={() => updateStatus("VERIFIED")}
            style={{ marginRight: "10px" }}
          >
            Verify
          </button>

          <button onClick={() => updateStatus("REJECTED")}>
            Reject
          </button>
        </>
      )}

      

      {record.status === "VERIFIED" && (
        <p style={{ color: "green", fontWeight: 600 }}>
          Onboarding Completed 
        </p>
      )}

      {record.status === "REJECTED" && (
        <p style={{ color: "red", fontWeight: 600 }}>
          Candidate must resubmit onboarding
        </p>
      )}

    </div>
  );
}

export default HrOnboardingDetails;
