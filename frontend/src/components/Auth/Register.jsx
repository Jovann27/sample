import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useMainContext } from "../../mainContext";
import "./auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    role: "Community Member",
    profilePic: null,
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
    employed: "",
    certificates: [],
    validId: null,
  });

  const [showPopup, setShowPopup] = useState(false);
  const { isAuthorized, setIsAuthorized, setUser, setTokenType } = useMainContext();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "certificates") {
        setFormData({ ...formData, certificates: Array.from(files) });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          if (key === "certificates") {
            formData[key].forEach((file) => submitData.append(key, file));
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setShowPopup(true);
      setUser(data.user);
      setIsAuthorized(true);
      setTokenType("user");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthorized", "true");
      localStorage.setItem("tokenType", "user");

      setTimeout(() => setShowPopup(false), 5000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <div className="login-container">
      <div className="login-card register-card">
        {/* Banner */}
        <div className="login-banner">
          <img
            src="https://i.ibb.co/MxKr7FVx/1000205778-removebg-preview.png"
            alt="Logo"
          />
          <h2>SkillConnect4B410</h2>
          <p>Create your account to book or offer services in the community.</p>
        </div>

        <form onSubmit={handleRegister} className="login-form register-form">
          {/* Profile Picture */}
          <div className="form-group file-upload register-file">
            <label htmlFor="profilePic" className="register-label">
              Upload Profile Picture:
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="register-input"
            />
            <div className="preview-box">
              {formData.profilePic ? (
                <img
                  src={URL.createObjectURL(formData.profilePic)}
                  alt="Profile Preview"
                />
              ) : (
                <span>No file</span>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="input-container icon-input">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Password */}
          <div className="input-container icon-input">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Confirm Password */}
          <div className="input-container icon-input">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Email */}
          <div className="input-container icon-input">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* First Name */}
          <div className="input-container icon-input">
            <i className="fas fa-id-card"></i>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Last Name */}
          <div className="input-container icon-input">
            <i className="fas fa-id-card"></i>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Phone */}
          <div className="input-container icon-input">
            <i className="fas fa-phone"></i>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Address */}
          <div className="input-container icon-input">
            <i className="fas fa-map-marker-alt"></i>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Birthdate */}
          <div className="input-container icon-input">
            <i className="fas fa-calendar"></i>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          {/* Employment Status */}
          <div className="input-container icon-input">
            <i className="fas fa-briefcase"></i>
            <select
              name="employed"
              value={formData.employed}
              onChange={handleChange}
              required
              className="register-input"
            >
              <option value="">Employment Status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="self-employed">Self-Employed</option>
            </select>
          </div>

          {/* Certificates */}
          <div className="input-container register-file">
            <label className="register-label">Upload Certificates</label>
            <input
              type="file"
              name="certificates"
              accept="image/*,application/pdf"
              multiple
              onChange={handleChange}
              className="register-input"
            />
            <div className="preview-box">
              {formData.certificates.length > 0 ? (
                formData.certificates.map((file, index) => (
                  <div key={index}>
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Certificate ${index + 1}`}
                      />
                    ) : (
                      <span>{file.name}</span>
                    )}
                  </div>
                ))
              ) : (
                <span>No files</span>
              )}
            </div>
          </div>

          {/* Valid ID */}
          <div className="input-container register-file">
            <label className="register-label">Upload Valid ID</label>
            <input
              type="file"
              name="validId"
              accept="image/*,application/pdf"
              onChange={handleChange}
              className="register-input"
            />
            <div className="preview-box">
              {formData.validId ? (
                formData.validId.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.validId)}
                    alt="Valid ID Preview"
                  />
                ) : (
                  <span>{formData.validId.name}</span>
                )
              ) : (
                <span>No file</span>
              )}
            </div>
          </div>

          <button type="submit" className="login-btn register-btn">
            Register
          </button>

          <div className="signup-link">
            <p>
              Already have an account? <Link to="/login">Login</Link> |{" "}
              <Link to="/admin/login">Admin Login</Link>
            </p>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>
              Your registration information will be verified by our officials.
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
