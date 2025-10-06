import {  useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useMainContext } from "./mainContext";

// Layout
import Loading from "./components/Layout/Loading";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Home pages
import Home from "./components/Home/Home";
import About from "./components/About/About";

// Auth pages
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminLogin from "./components/Auth/AdminLogin";
import AdminRegister from "./components/Admin/AdminRegister";

// Admin pages
import AdminDashboard from "./components/Admin/AdminDashboard";
import ServiceProviders from "./components/Admin/WorkersData";
import JobFairs from "./components/Admin/JobFairs";
import ReviewServiceRequest from "./components/Admin/ReviewServiceRequest";
import UserVerification from "./components/Admin/UserVerification";

// User pages
import UserDashboard from "./components/SkilledUSer/UserDashboard";
import ServiceRequest from "./components/SkilledUSer/ServiceRequest";
import PlaceOrder from "./components/SkilledUser/PlaceOrder";
import UserRecords from "./components/SkilledUser/UserRecords";
import UserSettings from "./components/SkilledUser/UserSettings";
import Help from "./components/SkilledUser/Help";
import SkilledWorkers from "./components/SkilledUSer/SkilledUsersList";
import UserRequest from "./components/SkilledUSer/UsersRequest";
import ManageProfile from "./components/SkilledUSer/ManageProfile";

import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const { isAuthorized, tokenType, authLoaded } = useMainContext();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = isAuthorized && tokenType === "admin";
  const isUser = isAuthorized && tokenType === "user";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Store the current path when it changes (except for login/register/home pages)
    if (isAuthorized && 
        !location.pathname.includes('/login') && 
        !location.pathname.includes('/register') &&
        location.pathname !== '/') {
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [location.pathname, isAuthorized]);

  useEffect(() => {
    if (isAuthorized && location.pathname === '/') {
      const lastPath = sessionStorage.getItem('lastPath');
      if (lastPath) {
        navigate(lastPath);
      } else {
        navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard');
      }
    }
  }, [isAuthorized, location.pathname, navigate, isAdmin]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location]);

  // while auth is being restored, don't run routing logic or redirects
  if (!authLoaded) return <Loading />;

  if (loading) return <Loading />;

  return (
    <>
      {!isAdmin && <Navbar />}
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/skilled-users-list" element={<SkilledWorkers />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/register"
          element={
            isAuthorized && isAdmin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminRegister />
            )
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={isUser ? <UserDashboard /> : <Navigate to="/login" />}
        >
          <Route path="dashboard" element={<div>Hello! Welcome to your dashboard!</div>} />
          <Route path="request-service" element={<ServiceRequest />} />
          <Route path="place-order" element={<PlaceOrder />} />
          <Route path="records" element={<UserRecords />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="help" element={<Help />} />
          <Route path="users-request" element={<UserRequest />} />
          <Route path="manage-profile" element={<ManageProfile />} />
        </Route>


        {/* Admin Routes */}
        <Route
          path="/admin/dashboard/*"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        >
          <Route path="service-providers" element={<ServiceProviders />} />
          <Route path="jobfairs" element={<JobFairs />} />
          <Route path="service-requests" element={<ReviewServiceRequest />} />
          <Route path="users" element={<UserVerification />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
