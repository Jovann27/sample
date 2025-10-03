import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMainContext } from "../../mainContext";

const ServiceRequest = () => {
  const { isAuthorized } = useMainContext();
  const [formData, setFormData] = useState({ serviceType: "", description: "", date: "", time: "" });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isAuthorized) return toast.error("You must log in to submit a service request");

    try {
      const response = await axios.post("http://localhost:4000/api/v1/service/request", formData, { withCredentials: true });
      toast.success(response.data.message || "Service request submitted!");
      setFormData({ serviceType: "", description: "", date: "", time: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit service request.");
    }
  };

  return (
    <section className="service-request-container">
      <h2 className="service-title">Request a Service</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label>Service Type</label>
          <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
            <option value="">-- Select a Service --</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe your service request..." required></textarea>
        </div>

        <div className="form-group">
          <label>Preferred Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Preferred Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </section>
  );
};

export default ServiceRequest;
