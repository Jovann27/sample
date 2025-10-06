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

  // ✅ Destructure `user` here to access it in JSX
  const { user, setUser, setIsAuthorized, setTokenType } = useMainContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/me", {
          withCredentials: true, // includes cookie with JWT
        });

        if (data.success) {
          setUser(data.user);
        } else {
          navigate("/home");
          console.error("User fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        navigate("/home");
      }
    };

    fetchUserData();
  }, [navigate, setUser]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });

      // Clear context and redirect
      setUser(null);
      setIsAuthorized(false);
      setTokenType(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✅ Handle loading state while fetching user data
  if (!user) {
    return <div className="loading">Loading user dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Profile Section */}
        <div className="profile-section">
          <img
            src={user.profilePic || "https://i.pravatar.cc/100"}
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.occupation || "No occupation listed"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user/manage-profile">
                <FaPlus /> Manage Profile
              </Link>
            </li>
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
              <Link to="/user/users-request">
                <FaUsers /> Service Request List
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

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
