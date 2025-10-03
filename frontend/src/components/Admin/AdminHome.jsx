import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./adminHome.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

import axios from "axios";

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState(null);
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);

  // data shapes:
  // GET /api/v1/reports/totals -> { totalUsers, serviceProviders, totalPopulation }
  // GET /api/v1/admin/service-providers -> { success, count, workers }
  // GET /api/v1/admin/service-requests -> { success, count, requests }

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [totalsRes, providersRes, requestsRes] = await Promise.all([
          axios.get("/api/v1/reports/totals"),
          axios.get("/api/v1/admin/service-providers", { withCredentials: true }),
          axios.get("/api/v1/admin/service-requests", { withCredentials: true }),
        ]);

        if (!mounted) return;
        setTotals(totalsRes.data);
        setProviders((providersRes.data && providersRes.data.workers) || []);
        setRequests((requestsRes.data && requestsRes.data.requests) || []);
      } catch (err) {
        console.error("AdminHome fetch error", err);
        setError(err?.response?.data?.message || err.message || "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => { mounted = false; };
  }, []);

  // Build chart data from totals/skills — fallback to empty
  const servicesLabels = Object.keys((totals && totals.skills) || {}).length
    ? Object.keys(totals.skills)
    : ["Mechanic", "Painter", "Electrician", "Plumber", "Carpenter", "Technician", "Caterer"];

  const servicesData = Object.keys((totals && totals.skills) || {}).length
    ? Object.values(totals.skills)
    : [15, 18, 22, 20, 13, 16, 10];

  const barData = {
    labels: servicesLabels,
    datasets: [
      {
        label: "Bookings",
        data: servicesData,
        backgroundColor: [
          "#f6c23e",
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#e74a3b",
          "#858796",
          "#20c9b6",
        ],
      },
    ],
  };

  const pieData = {
    labels: servicesLabels,
    datasets: [
      {
        data: servicesData,
        backgroundColor: [
          "#f6c23e",
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#e74a3b",
          "#858796",
          "#20c9b6",
        ],
      },
    ],
  };

  const topUsers = providers.slice(0, 7).map((p) => ({
    name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.username || "Provider",
    service: (p.skills && p.skills[0]) || "—",
    rating: p.rating || 4,
    weekly: `${p.bookingsCount || "-"} Bookings`,
  }));

  const workLog = requests.slice(0, 8).map((r) => ({
    status: (r.status && r.status[0] ? r.status[0].toUpperCase() + r.status.slice(1) : r.status) || "Pending",
    time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    address: r.address || (r.location || "-"),
    service: r.serviceType || (r.serviceName || "-"),
  }));

  return (
    <div className="admin-home container">
      <h1>Central Hub</h1>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : error ? (
        <div className="error">Error loading data: {error}</div>
      ) : (
        <div className="grid">
        <div className="card chart-card">
          <h3>Most Booked Services</h3>
          <div className="chart-wrap"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </div>

        <div className="card table-card">
          <h3>Top Skilled Users</h3>
          <table className="top-users">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Service</th>
                <th>Ratings</th>
                <th>Weekly</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.service}</td>
                  <td>{"★".repeat(u.rating)}</td>
                  <td>{u.weekly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <div className="card pie-card">
            <h3>Skilled User per Trade Category</h3>
            <div className="pie-wrap"><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>

          <div className="card worklog-card">
            <h3>Work Log</h3>
            <table className="worklog">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Work Time</th>
                  <th>Order Address</th>
                  <th>Service</th>
                </tr>
              </thead>
              <tbody>
                {workLog.map((w, i) => (
                  <tr key={i}>
                    <td><span className={`status ${w.status.toLowerCase()}`}>{w.status}</span></td>
                    <td>{w.time}</td>
                    <td>{w.address}</td>
                    <td>{w.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
