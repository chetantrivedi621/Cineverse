import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authStore";
import { forgotPassword, resetPassword } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // login, register, forgot, reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("USER");
  const [newPassword, setNewPassword] = useState("");
  const [cinemaName, setCinemaName] = useState("");
  const [city, setCity] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials or login failed.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await register(name, email, password, role, cinemaName, city);
      if (role === "THEATRE_OWNER" && (!res || !res.token)) {
        setMessage("Registration Request Submitted! Your theatre account is pending approval by the Admin. Once approved, you can log in.");
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        setCinemaName("");
        setCity("");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Check your inputs.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "Password reset requested. Check your email.");
      setMode("reset");
    } catch (err) {
      setError(err.response?.data?.message || "User email not found.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await resetPassword(email, newPassword);
      setMessage(res.message || "Password successfully reset!");
      setMode("login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Check inputs.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-backdrop-overlay"></div>
      
      <div className="login-box">
        <div className="login-header">
          <h1>Cine<span className="logo-accent">Verse</span></h1>
          <p className="login-subtitle">Your Ultimate Movie Hub</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Sign In</h2>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Sign In</button>
            <div className="form-helpers">
              <span onClick={() => { setMode("register"); clearMessages(); }}>New to CineVerse? <strong className="highlight">Sign up now</strong></span>
              <span onClick={() => { setMode("forgot"); clearMessages(); }}>Forgot Password?</span>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="login-form">
            <h2>Sign Up</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="input-label">Select Workspace Role</label>
              <div className="role-selector-tiles">
                <div 
                  type="button"
                  className={`role-tile ${role === "USER" ? "active" : ""}`}
                  onClick={() => setRole("USER")}
                >
                  <span className="tile-label">User</span>
                </div>
                <div 
                  type="button"
                  className={`role-tile ${role === "THEATRE_OWNER" ? "active" : ""}`}
                  onClick={() => setRole("THEATRE_OWNER")}
                >
                  <span className="tile-label">Owner</span>
                </div>
              </div>
            </div>

            {role === "THEATRE_OWNER" && (
              <>
                <div className="form-group animate-fade-in">
                  <input
                    type="text"
                    placeholder="Cinema Name (e.g. PVR Elante Mall)"
                    value={cinemaName}
                    onChange={(e) => setCinemaName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group animate-fade-in">
                  <input
                    type="text"
                    placeholder="City Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            <button type="submit" className="login-btn">Sign Up</button>
            <div className="form-helpers">
              <span onClick={() => { setMode("login"); clearMessages(); }}>Already registered? <strong className="highlight">Sign in</strong></span>
            </div>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="login-form">
            <h2>Forgot Password</h2>
            <p className="form-desc">Enter your email and we'll send reset instructions.</p>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Next</button>
            <div className="form-helpers">
              <span onClick={() => { setMode("login"); clearMessages(); }}>Back to Sign In</span>
            </div>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleResetPassword} className="login-form">
            <h2>Reset Password</h2>
            <p className="form-desc">Reset password for <strong style={{ color: "#fff" }}>{email}</strong></p>
            <div className="form-group">
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Reset Password</button>
            <div className="form-helpers">
              <span onClick={() => { setMode("login"); clearMessages(); }}>Back to Sign In</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
