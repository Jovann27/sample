import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewServiceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skillFilter, setSkillFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField] = useState('createdAt');
  const [sortOrder] = useState('desc');

  const fetchPage = async (p = 1, l = limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', p);
      params.set('limit', l);
      if (skillFilter) params.set('skill', skillFilter);
      if (statusFilter) params.set('status', statusFilter);
      params.set('sort', `${sortField}:${sortOrder}`);

      const res = await axios.get(`http://localhost:4000/api/v1/admin/service-requests?${params.toString()}`, { withCredentials: true });
      setRequests(res.data.requests || []);
      setPage(res.data.page || p);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // fetch initial page
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Service Requests</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Filter by skill" value={skillFilter} onChange={e=>setSkillFilter(e.target.value)} />
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={limit} onChange={e=>{ setLimit(parseInt(e.target.value)); fetchPage(1, parseInt(e.target.value)); }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <button onClick={()=>fetchPage(1)}>Apply</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r._id}>
                  <td>{r.user?.username || r.user?.email || '—'}</td>
                  <td>{r.serviceType}</td>
                  <td>{r.description}</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <div>Total: {total}</div>
            <div>
              <button disabled={page<=1} onClick={()=>fetchPage(page-1)}>Previous</button>
              <span style={{ margin: '0 8px' }}>Page {page} / {totalPages}</span>
              <button disabled={page>=totalPages} onClick={()=>fetchPage(page+1)}>Next</button>
            </div>
            <div>
              <label>Jump to: <input type="number" min={1} max={totalPages} onKeyDown={e=>{ if(e.key==='Enter'){ const v = parseInt(e.target.value); if(v>=1 && v<=totalPages) fetchPage(v); } }} /></label>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewServiceRequest;
