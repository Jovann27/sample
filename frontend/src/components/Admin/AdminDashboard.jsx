import { Link, Outlet, useNavigate, useMatch } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMainContext } from "../../mainContext";
import "./admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setAdmin, setIsAuthorized, setTokenType, tokenType, authLoaded } = useMainContext();
  const matchDashboardRoot = useMatch({ path: '/admin/dashboard', end: true });
  const isDashboardHome = !!matchDashboardRoot;
  const [loadingData, setLoadingData] = useState(true);
  const [totals, setTotals] = useState({ totalUsers: 0, serviceProviders: 0, totalPopulation: 0 });
  const [openRequestsCount, setOpenRequestsCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [providersCount, setProvidersCount] = useState(0);
  const [latestJobFair, setLatestJobFair] = useState(null);
  const [error, setError] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [skillsReport, setSkillsReport] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [filtering, setFiltering] = useState(false);
  const [skilledPerTrade, setSkilledPerTrade] = useState(null);
  const [mostBooked, setMostBooked] = useState(null);
  const [totalsOverTime] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/admin/auth/me", {
          withCredentials: true,
        });
        setAdmin(data.admin);
        setIsAuthorized(true);
        setTokenType("admin");
        // after admin is confirmed, fetch dashboard data
        await fetchDashboardData();
        return;
      } catch (error) {
        // If admin fetch fails, clear admin state and navigate to admin login
        setIsAuthorized(false);
        setAdmin(null);
        setTokenType(null);
        navigate("/admin/login");
        console.error("Failed to fetch admin data:", error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        setError(null);

        // totals (users + service providers)
        const totalsRes = await axios.get("http://localhost:4000/api/v1/reports/totals");
        setTotals(totalsRes.data || {});

        // service requests
        const requestsRes = await axios.get("http://localhost:4000/api/v1/admin/service-requests", { withCredentials: true });
        setOpenRequestsCount(requestsRes.data?.count || 0);
        setRecentRequests((requestsRes.data?.requests || []).slice(0, 5));

        // service providers
        const providersRes = await axios.get("http://localhost:4000/api/v1/admin/service-providers", { withCredentials: true });
        setProvidersCount(providersRes.data?.count || (providersRes.data?.workers || []).length || 0);

        // latest job fair
        try {
          const jf = await axios.get("http://localhost:4000/api/v1/settings/jobfair");
          setLatestJobFair(jf.data?.jobfair || null);
        } catch {
          // no job fair OK
          setLatestJobFair(null);
        }

        // demographics for chart
        try {
          const demo = await axios.get("http://localhost:4000/api/v1/reports/demographics");
          setDemographics(demo.data || null);
        } catch {
          setDemographics(null);
        }

        // skills report
        try {
          const s = await axios.get("http://localhost:4000/api/v1/reports/skills");
          setSkillsReport(s.data || null);
        } catch {
          setSkillsReport(null);
        }

        // skilled per trade
        try {
          const sp = await axios.get("http://localhost:4000/api/v1/reports/skilled-per-trade");
          setSkilledPerTrade(sp.data || null);
        } catch {
          setSkilledPerTrade(null);
        }

        // most booked services
        try {
          const mb = await axios.get("http://localhost:4000/api/v1/reports/most-booked-services");
          setMostBooked(mb.data || null);
        } catch {
          setMostBooked(null);
        }

      } catch (err) {
        console.error("Dashboard data fetch failed", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoadingData(false);
      }
    };

    // Only attempt admin fetch when the app has restored auth and the tokenType is admin
    if (!authLoaded) return; // wait until mainContext finishes restoring

    if (tokenType !== "admin") {
      // not an admin — don't attempt admin-only API calls or redirect here
      setLoadingData(false);
      return;
    }

    // start by fetching admin then dashboard
    fetchAdminData();
  }, [navigate, setAdmin, setIsAuthorized, setTokenType, tokenType, authLoaded]);

  // register Chart components
  ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

  const logout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/admin/auth/logout", {
        withCredentials: true,
      });
      window.location.href = "/";;
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
            <li><Link to="/admin/dashboard">🏠 Dashboard Home</Link></li>
            <li><Link to="/admin/dashboard/jobfairs">📢 Create Job Fair</Link></li>
            <li><Link to="/admin/dashboard/service-requests">📄 Manage Service Requests</Link></li>
            <li><Link to="/admin/dashboard/users">✅ Applications</Link></li>
            <li><Link to="/admin/dashboard/service-providers">🛠️ View Service Providers</Link></li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={logout}>⬅ Logout</button>
      </aside>
      <div className="content-wrapper">
        <header className="top-navbar">
          <div className="top-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Welcome back, {displayName} 👋</p>
          </div>
          <div className="top-right">
            <input type="text" placeholder="Search..." className="search-bar" />
            <div className="top-icons">� ✉️</div>
          </div>
        </header>

        <main className="main-content">
          {isDashboardHome && (
            <>
              <section className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{loadingData ? "..." : totals.totalUsers ?? 0}</p>
              <p className="stat-sub">Registered users</p>
            </div>

            <div className="stat-card">
              <h3>Open Requests</h3>
              <p className="stat-value">{loadingData ? "..." : openRequestsCount}</p>
              <p className="stat-sub">Pending service requests</p>
            </div>

            <div className="stat-card">
              <h3>Service Providers</h3>
              <p className="stat-value">{loadingData ? "..." : (totals.serviceProviders ?? providersCount)}</p>
              <p className="stat-sub">Verified providers</p>
            </div>

            <div className="stat-card">
              <h3>Latest Job Fair</h3>
              <p className="stat-value">{loadingData ? "..." : (latestJobFair?.title ? latestJobFair.title : "None")}</p>
              <p className="stat-sub">{latestJobFair ? new Date(latestJobFair.date).toLocaleDateString() : "No upcoming"}</p>
            </div>
        </section>

        <section className="dashboard-layout">
            <div className="left-col">
              <div className="card chart-card">
                <h3>Activity Overview</h3>
                <div className="chart-area">
                  {demographics && demographics.ageGroups ? (
                    (() => {
                      const labels = Object.keys(demographics.ageGroups);
                      const values = Object.values(demographics.ageGroups);
                      const data = {
                        labels,
                        datasets: [
                          {
                            label: 'Users by age group',
                            data: values,
                            backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe'],
                          },
                        ],
                      };
                      const options = {
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: false },
                        },
                      };
                      return <Bar data={data} options={options} />;
                    })()
                  ) : (
                    <div className="chart-placeholder">No demographic data</div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3>Totals Over Time</h3>
                <div className="chart-area">
                  {totalsOverTime && totalsOverTime.labels ? (
                    (() => {
                      const data = { labels: totalsOverTime.labels, datasets: [{ label: 'New Users', data: totalsOverTime.values, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)' }] };
                      const options = { responsive: true, plugins: { legend: { display: false } } };
                      return <Line data={data} options={options} />;
                    })()
                  ) : (
                    <div className="chart-placeholder">No time series data</div>
                  )}
                </div>
              </div>

              <div className="card recent-card">
                <h3>Recent Requests</h3>
                {loadingData ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="error">{error}</p>
                ) : recentRequests.length === 0 ? (
                  <p>No recent requests</p>
                ) : (
                  <div>
                    {activeSkill && (
                      <div style={{ marginBottom: 8 }}>
                        <strong>Filter:</strong> {activeSkill} <button className="action-btn" onClick={async () => {
                          setActiveSkill(null);
                          setFiltering(true);
                          try {
                            const res = await axios.get("http://localhost:4000/api/v1/admin/service-requests", { withCredentials: true });
                            setRecentRequests((res.data?.requests || []).slice(0,5));
                            setOpenRequestsCount(res.data?.count || 0);
                          } catch (err) {
                            console.error('Failed to reload requests', err);
                          } finally {
                            setFiltering(false);
                          }
                        }}>Clear</button>
                      </div>
                    )}

                    <ul className="recent-list">
                      {(filtering ? [{ _id: 'loading', description: 'Loading...' }] : recentRequests)
                        .map((r) => (
                        <li key={r._id}>{r.title || r.serviceType || r.description || 'Request'} — {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                      <button disabled={page <= 1 || filtering} onClick={async () => { if (page>1) { setPage(p=>p-1); setFiltering(true); try { const res = await axios.get(`http://localhost:4000/api/v1/admin/service-requests?page=${page-1}&limit=${limit}`, { withCredentials: true }); setRecentRequests(res.data?.requests||[]); setOpenRequestsCount(res.data?.total||0); setTotalPages(res.data?.totalPages||1); } catch(err){console.error(err);} finally{setFiltering(false);} } }}>Previous</button>
                      <div>Page {page} / {totalPages}</div>
                      <button disabled={page >= totalPages || filtering} onClick={async () => { if (page<totalPages) { setPage(p=>p+1); setFiltering(true); try { const res = await axios.get(`http://localhost:4000/api/v1/admin/service-requests?page=${page+1}&limit=${limit}`, { withCredentials: true }); setRecentRequests(res.data?.requests||[]); setOpenRequestsCount(res.data?.total||0); setTotalPages(res.data?.totalPages||1); } catch(err){console.error(err);} finally{setFiltering(false);} } }}>Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="right-col">
              {skilledPerTrade && (
                <div className="card">
                  <h3>Skilled Users per Trade</h3>
                  <ul className="recent-list">
                    {Object.entries(skilledPerTrade.byRole || {}).map(([role, count]) => (
                      <li key={role}>{role}: {count}</li>
                    ))}
                  </ul>
                </div>
              )}

              {mostBooked && (
                <div className="card">
                  <h3>Most Booked Services</h3>
                  <div className="chart-area small">
                    {(() => {
                      const entries = Object.entries(mostBooked).slice(0,8);
                      const labels = entries.map(e=>e[0]);
                      const values = entries.map(e=>e[1]);
                      const data = { labels, datasets: [{ label: 'Bookings', data: values, backgroundColor: '#f59e0b' }] };
                      const options = { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } };
                      return <Bar data={data} options={options} />;
                    })()}
                  </div>
                </div>
              )}
              <div className="card skills-card">
                <h3>Top Skills</h3>
                <div className="chart-area small">
                  {skillsReport ? (
                    (() => {
                      const entries = Object.entries(skillsReport).sort((a,b)=>b[1]-a[1]).slice(0,8);
                      const labels = entries.map(e=>e[0]);
                      const values = entries.map(e=>e[1]);
                      const data = {
                        labels,
                        datasets: [{
                          label: 'Number of users',
                          data: values,
                          backgroundColor: '#34d399'
                        }]
                      };
                      const options = {
                        indexAxis: 'y',
                        responsive: true,
                        plugins: { legend: { display: false } },
                        onClick: (evt, elements) => {
                          if (!elements.length) return;
                          const idx = elements[0].index;
                          const skill = labels[idx];
                          (async () => {
                            try {
                              setFiltering(true);
                              setActiveSkill(skill);
                              const res = await axios.get(`http://localhost:4000/api/v1/admin/service-requests?skill=${encodeURIComponent(skill)}`, { withCredentials: true });
                              setRecentRequests((res.data?.requests || []).slice(0, 20));
                              setOpenRequestsCount(res.data?.count || 0);
                            } catch (err) {
                              console.error('Failed to fetch filtered requests', err);
                            } finally {
                              setFiltering(false);
                            }
                          })();
                        }
                      };
                      return <Bar data={data} options={options} />;
                    })()
                  ) : (
                    <div className="chart-placeholder">No skills data</div>
                  )}
                </div>
              </div>
              <div className="card activity-card">
                <h3>Recent Activities</h3>
                <ul className="activity-list">
                  <li>Open requests: {openRequestsCount}</li>
                  <li>Providers: {loadingData ? '...' : providersCount}</li>
                  <li>Latest job fair: {latestJobFair ? latestJobFair.title : 'None'}</li>
                </ul>
              </div>

              <div className="card small-card">
                <h3>Quick Actions</h3>
                <div className="actions">
                  <Link to="/admin/dashboard/jobfairs" className="action-btn">Create Job Fair</Link>
                  <Link to="/admin/dashboard/service-requests" className="action-btn">Manage Requests</Link>
                </div>
              </div>
            </div>
              </section>
            </>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
