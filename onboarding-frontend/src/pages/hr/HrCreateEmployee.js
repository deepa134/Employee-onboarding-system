import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function HrCreateEmployee() {

  const { email } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    department: "",
    designation: "",
    workLocation: "",
    workMode: "",
    employmentType: "",
    dateOfJoining: "",
    reportingTime: "",
    managerName: "",
    managerEmail: "",
    managerContact: "",
    accommodation: "",
    officialEmail: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    await axios.post("http://localhost:8080/api/employees", {
      ...form,
      email
    });

    alert("Employee Created & Mail Sent ✅");

    navigate("/hr/dashboard");
  };

  return (
    <div style={{ padding: "30px" }}>

      <h2>Create Employee</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", padding: "8px" }}
        />
      ))}

      <button onClick={handleSubmit}>Submit</button>

    </div>
  );
}

export default HrCreateEmployee;
