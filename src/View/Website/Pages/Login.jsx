import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_AUTH } from "../../../config/api";
import { clearGuest } from "../../../utils/auth";

const loginUrl = `${API_AUTH}/login`;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
        })
      });

      let data = {};
      try {
        data = await res.json();
      } catch(parseError) {
        setError('Unexpected response from server.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Login failed!');
      } else {
        // Save the token to localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        const userFromApi =
          data.user ||
          data.data?.user ||
          data.profile ||
          (data._id || data.id ? { _id: data._id || data.id } : null);
        if (userFromApi) {
          try {
            localStorage.setItem("auth_user", JSON.stringify(userFromApi));
          } catch {
            // ignore storage errors
          }
        }
        clearGuest();
        setSuccess('Login successful!');
        const next = location.state?.from && location.state.from !== "/login"
          ? location.state.from
          : "/live";
        navigate(next, { replace: true });
      }
    } catch (err) {
      setError('Cannot connect to API. Is it running? Network error: ' + err.message);
    }
    setLoading(false);
  };

  return (

<div>

<div className="app-login-screen">

  {/* TOP BACKGROUND */}
  <div className="app-login-header">
    <div className="header-glow"></div>

    <div className="brand-logo">
      <img src="/images/logo.png" alt="Logo" />
    </div>

    <h2>Welcome Back</h2>
    <p>Sign in to continue your journey</p>
  </div>

  {/* LOGIN CARD */}
  <div className="app-login-card">

    <form onSubmit={handleSubmit} className="app-login-form">

      {/* PHONE */}
      <div className="app-form-group">
        <label>Phone Number</label>

        <div className="app-input-box">
          <div className="input-icon">
            <i className="bi bi-phone"></i>
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

{/* PASSWORD */}
<div className="app-form-group">

  <label>
    Password
  </label>

  <div className="app-input-box">

    <div className="input-icon">
      <i className="bi bi-lock"></i>
    </div>

    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      value={form.password}
      onChange={handleChange}
      required
    />

    {/* EYE BUTTON */}
    <button
      type="button"
      className="app-password-toggle"
      onClick={() => setShowPassword(!showPassword)}
    >
      {
        showPassword ? (
          <i className="bi bi-eye-slash-fill"></i>
        ) : (
          <i className="bi bi-eye-fill"></i>
        )
      }
    </button>

  </div>

</div>

      {/* OPTIONS */}
      <div className="app-login-options">

        <label className="remember-check">
          <input type="checkbox" />
          <span>Remember Me</span>
        </label>

        <a href="/">
          Forgot Password?
        </a>

      </div>

      {/* ALERTS */}
      {error && (
        <div className="app-alert error-alert">
          {error}
        </div>
      )}

      {success && (
        <div className="app-alert success-alert">
          {success}
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        className="app-login-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm"></span>
            Logging in...
          </>
        ) : (
          <>
            Login Now
            <i className="bi bi-arrow-right"></i>
          </>
        )}
      </button>

    </form>

    {/* DIVIDER */}
    <div className="app-divider">
      <span>OR</span>
    </div>

    {/* SOCIAL LOGIN */}
    <div className="social-login">

      <button className="social-btn">
        <i className="bi bi-google"></i>
      </button>

      <button className="social-btn">
        <i className="bi bi-facebook"></i>
      </button>

      <button className="social-btn">
        <i className="bi bi-apple"></i>
      </button>

    </div>

    {/* SIGNUP */}
    <div className="signup-text">
      Don’t have an account?
      <Link to="/signup"> Create Account</Link>
    </div>

    <div className="signup-text" style={{ marginTop: 10 }}>
      Or <Link to="/">go back</Link> and start as a guest.
    </div>

  </div>

</div>

</div>

  );
}
