import { useEffect, useState } from "react";
import "./service.css";

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch all service requests
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/settings/service-requests")

      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  // Accept a service request
  const acceptRequest = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/settings/service-requests/${id}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("Work accepted successfully!");
        fetchRequests();
      } else {
        alert("Failed to accept request.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (requests.length === 0) return <div>No service requests found.</div>;


  return (
    <div className="service-requests-container">
      <h2 className="title">Service Request Listings</h2>
      <table className="service-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Service Type</th>
            <th>Description</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.user?.name || "N/A"}</td>
              <td>{req.serviceType}</td>
              <td>{req.description}</td>
              <td>{req.date}</td>
              <td>{req.time}</td>
              <td className={`status ${req.status}`}>{req.status}</td>
              <td>
                {req.status === "pending" ? (
                  <button className="accept-btn" onClick={() => acceptRequest(req._id)}>
                    Accept Work
                  </button>
                ) : (
                  <span className="accepted-label">Accepted</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceRequests;
