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
  background: "#fff",
  fontFamily: "sans-serif"
};

const card = {
  padding: "25px",
  width: "320px",
  border: "1px solid #000"
};

const title = {
  marginBottom: "5px",
  fontSize: "20px"
};

const subtitle = {
  marginBottom: "15px",
  fontSize: "13px"
};

const roleContainer = {
  display: "flex",
  gap: "5px",
  marginBottom: "15px"
};

const roleBtn = (active) => ({
  flex: 1,
  padding: "6px",
  border: "1px solid #000",
  background: active ? "#000" : "#fff",
  color: active ? "#fff" : "#000",
  cursor: "pointer"
});

const input = {
  width: "100%",
  padding: "7px",
  marginBottom: "10px",
  border: "1px solid #000"
};

const loginBtn = {
  width: "100%",
  padding: "8px",
  background: "#000",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

