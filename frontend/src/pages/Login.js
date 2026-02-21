import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 1. Await the login response. If it fails, it will jump to catch.
      const data = await loginUser({ email, password });

      // 2. Token and role are already saved in authService
      // 3. Dispatch custom event to notify App.js of login state change
      window.dispatchEvent(new CustomEvent("authStateChange"));
      
      // 4. Redirect based on the role from the API response
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      // 5. Handle ALL errors here (network, invalid credentials, etc.)
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message || // Specific message from backend
        err.message || // Generic network error message
        "Invalid email or password"; // Fallback message

      alert(errorMessage);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center text-primary mb-3">MyFin Bank</h3>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center mt-3">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
