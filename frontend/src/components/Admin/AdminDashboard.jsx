import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useMainContext } from "../../mainContext";
import "./admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setAdmin, setIsAuthorized, setTokenType } = useMainContext();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/admin/auth/me", {
          withCredentials: true,
        });
        setAdmin(data.admin);
        setIsAuthorized(true);
        setTokenType("admin");
        
        return;
      } catch (error) {
        navigate("/admin/login");
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const logout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/admin/auth/logout", {
        withCredentials: true,
      });
      navigate("/admin/login");
      setIsAuthorized(false);
      setAdmin(null);
      setTokenType(null);
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayName = "Admin";
  const profilePic = "default-avatar.png";

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src={`http://localhost:4000/uploads/${profilePic}`}
            alt="Admin Avatar"
            className="avatar"
          />
          <h2>{displayName}</h2>
          <p className="status">● Online</p>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><Link to="">🏠 Dashboard Home</Link></li>
            <li><Link to="jobfairs">📢 Create Job Fair</Link></li>
            <li><Link to="service-requests">📄 Manage Service Requests</Link></li>
            <li><Link to="users">✅ Applications</Link></li>
            <li><Link to="service-providers">🛠️ View Service Providers</Link></li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={logout}>⬅ Logout</button>
      </aside>

      <div className="content-wrapper">
        <header className="top-navbar">
          <input type="text" placeholder="🔍 Search Dashboard" className="search-bar" />
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
