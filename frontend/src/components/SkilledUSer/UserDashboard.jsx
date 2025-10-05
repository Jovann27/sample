import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import {
  FaShoppingCart,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import { useMainContext } from "../../mainContext";
import "./user.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthorized, setTokenType } = useMainContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await 
        axios.get("http://localhost:4000/api/v1/user/me", {
          withCredentials: true,
        });
        setUser(data.user);
      } catch {
        navigate("/home");
        console.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate, setUser]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });

      // Clear frontend context
      setUser(null);
      setIsAuthorized(false);
      setTokenType(null);

      // Redirect home
      window.location.href = "/";
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Profile Section */}
        <div className="profile-section">
          <img
            src="https://i.pravatar.cc/100"
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h3>Andrew Smith</h3>
            <p>Product Designer</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <h4 className="sidebar-title">Main</h4>
          <ul>
            <li>
              <Link to="/user/place-order">
                <FaShoppingCart /> Place Order
              </Link>
            </li>
            <li>
              <Link to="/user/records">
                <FaClipboardList /> My Records
              </Link>
            </li>
            <li>
              <Link to="/user/skilled-workers">
                <FaUsers /> Skilled Workers
              </Link>
            </li>
            <li>
              <Link to="/user/settings">
                <FaCog /> Settings
              </Link>
            </li>
            <li>
              <Link to="/user/help">
                <FaQuestionCircle /> Help
              </Link>
            </li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="main-content">

        
        <Outlet />
      </main> 
    </div>
  );
};

export default UserDashboard;
