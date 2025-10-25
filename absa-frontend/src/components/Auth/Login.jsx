import React, { useState } from "react";
import "./auth.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import avatar from '../../assets/avatar.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     const response = await axios.post("http://localhost:5000/api/auth/login", {
  email,
  password,
});


      console.log("Backend response:", response.data);

      if (response.data.token) {
        // Store user and token
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        navigate("/dashboard", { replace: true });
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      if (err.response) {
        // Backend returned error response
        setError(err.response.data.message || "Login failed");
      } else {
        // Network or other error
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={avatar} alt="Avatar" className="avatar" />
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
