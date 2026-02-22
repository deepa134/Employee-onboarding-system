import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const interviewers = {
    Kavya: { id: 1, password: "kavya123" },
    Arun: { id: 2, password: "arun123" },
    Divya: { id: 3, password: "divya123" }
  };

  const handleLogin = () => {

    if (role === "CANDIDATE") {
      if (!email) return alert("Enter email");
      login("CANDIDATE", { email });
      navigate("/candidate/dashboard");
    }

    if (role === "HR") {
      login("HR");
      navigate("/hr/dashboard");
    }

    if (role === "INTERVIEWER") {

      const interviewer = interviewers[name];

      if (!interviewer || interviewer.password !== password) {
        alert("Invalid credentials");
        return;
      }

      login("INTERVIEWER", {
        interviewerId: interviewer.id,
        interviewerName: name
      });

      navigate(`/interviewer/${interviewer.id}`);
    }
  };

  return (
    <div style={page}>

      <div style={card}>

        <h2 style={title}>Employee Onboarding Portal</h2>
        <p style={subtitle}>Login to continue</p>

        <div style={roleContainer}>
          <button style={roleBtn(role === "CANDIDATE")} onClick={() => setRole("CANDIDATE")}>Candidate</button>
          <button style={roleBtn(role === "HR")} onClick={() => setRole("HR")}>HR</button>
          <button style={roleBtn(role === "INTERVIEWER")} onClick={() => setRole("INTERVIEWER")}>Interviewer</button>
        </div>

        {role === "CANDIDATE" && (
          <input
            style={input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {role === "INTERVIEWER" && (
          <>
            <select style={input} value={name} onChange={(e) => setName(e.target.value)}>
              <option value="">Select Interviewer</option>
              <option value="Kavya">Kavya</option>
              <option value="Arun">Arun</option>
              <option value="Divya">Divya</option>
            </select>

            <input
              style={input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <button style={loginBtn} onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
};

export default Login;





/* 🎨 STYLES */

const page = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  fontFamily: "Inter, sans-serif"
};

const card = {
  width: "360px",
  padding: "35px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.15)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
  textAlign: "center",
  color: "white",
  animation: "fadeIn 0.6s ease"
};

const title = {
  marginBottom: "5px"
};

const subtitle = {
  fontSize: "14px",
  color: "#cbd5e1",
  marginBottom: "20px"
};

const roleContainer = {
  display: "flex",
  gap: "8px",
  marginBottom: "18px"
};

const roleBtn = (active) => ({
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #64748b",
  background: active ? "#38bdf8" : "transparent",
  color: active ? "#0f172a" : "#cbd5e1",
  fontWeight: active ? "600" : "400",
  cursor: "pointer",
  transition: "0.2s"
});

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  marginBottom: "12px",
  outline: "none"
};

const loginBtn = {
  width: "100%",
  padding: "11px",
  background: "#38bdf8",
  color: "#0f172a",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.2s"
};
