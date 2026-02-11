import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <button onClick={() => {
        login("CANDIDATE");
        navigate("/candidate/dashboard");
      }}>
        Login as Candidate
      </button>

      <br /><br />

      <button onClick={() => {
        login("HR");
        navigate("/hr/dashboard");
      }}>
        Login as HR
      </button>
    </div>
  );
};

export default Login;
