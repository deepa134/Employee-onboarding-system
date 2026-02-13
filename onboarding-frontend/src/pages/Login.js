import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px" }}
      />

      <br />

      <button
        onClick={() => {
          if (!email) {
            alert("Please enter email");
            return;
          }
          login("CANDIDATE", email);   // 🔥 Important
          navigate("/candidate/dashboard");
        }}
      >
        Login as Candidate
      </button>

      <br /><br />

      <button
        onClick={() => {
          login("HR", email || "hr@company.com");
          navigate("/hr/dashboard");
        }}
      >
        Login as HR
      </button>
    </div>
  );
};

export default Login;
