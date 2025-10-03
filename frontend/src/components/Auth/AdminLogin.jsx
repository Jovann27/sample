import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useMainContext } from "../../mainContext";
import "./auth.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthorized, setUser, setTokenType } = useMainContext();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/admin/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setUser(data.user);
      setIsAuthorized(true);
      setTokenType("admin");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthorized", "true");
      localStorage.setItem("tokenType", "admin");

      toast.success(data.message);

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card admin-card">
        <div className="login-banner">
          <img
            src="https://i.ibb.co/MxKr7FVx/1000205778-removebg-preview.png"
            alt="Logo"
          />
          <h2>Admin Login</h2>
        </div>

        <form onSubmit={handleAdminLogin} className="login-form admin-form">
          <div className="input-container icon-input">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-input"
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
              className="admin-input"
            />
          </div>

          <button type="submit" className="login-btn admin-btn">
            Sign In
          </button>

          <div className="signup-link">
            <p>
              Not an admin? <Link to="/login">Go to User Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
