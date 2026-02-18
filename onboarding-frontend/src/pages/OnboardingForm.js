import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function OnboardingForm() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const applicationId = location.state?.applicationId;

  const [formData, setFormData] = useState({
    address: "",
    aadhaar: "",
    pan: "",
    bankAccount: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/onboarding", {
        ...formData,
        email: user.email,
        applicationId: applicationId
      });

      alert("Onboarding submitted successfully");
      navigate("/candidate/dashboard");

    } catch (err) {
      console.log(err);
      alert("Error submitting form");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Employee Onboarding Form</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px", gap: "10px" }}>

        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} required />
        <input name="pan" placeholder="PAN Number" onChange={handleChange} required />
        <input name="bankAccount" placeholder="Bank Account Number" onChange={handleChange} required />

        <button type="submit">Submit</button>

      </form>
    </div>
  );
}

export default OnboardingForm;
