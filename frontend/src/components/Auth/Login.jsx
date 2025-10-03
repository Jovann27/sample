import { useState,  useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useMainContext } from "../../mainContext";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthorized, setUser, setTokenType } = useMainContext();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const isAuth = localStorage.getItem("isAuthorized") === "true";
    const type = localStorage.getItem("tokenType");

    if (storedUser && isAuth) {
      setUser(storedUser);
      setIsAuthorized(true);
      setTokenType(type);
      if (window.location.pathname !== "/login") {
        if (type === "admin") navigate("/admin/dashboard");
        else navigate("/");
      }
    }
  }, [navigate, setUser, setIsAuthorized, setTokenType]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password },
        { withCredentials: true }
      );

      setUser(data.user);
      setIsAuthorized(true);
      setTokenType("user");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthorized", "true");
      localStorage.setItem("tokenType", "user");

      toast.success(data.message);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card user-card">
        <div className="login-banner">
          <img
            src="https://i.ibb.co/MxKr7FVx/1000205778-removebg-preview.png"
            alt="Logo"
          />
          <h2>User Login</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form user-form">
          <div className="input-container icon-input">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="input-container icon-input">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-btn user-btn">
            Sign In
          </button>

          <div className="signup-link">
            <p>
              No account? <Link to="/register">Sign up</Link> |{" "}
              <Link to="/admin/login">Admin Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
