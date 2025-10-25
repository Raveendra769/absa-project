import React, { useState } from "react";
import "./auth.css";
import { FaEnvelope } from "react-icons/fa";
import avatar from '../../assets/avatar.png';
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Password reset link sent!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={avatar} alt="Avatar" className="avatar" />
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="signup-text">
            Remembered your password? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
