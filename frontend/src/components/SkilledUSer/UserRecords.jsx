import { useEffect, useState } from "react";
import axios from "axios";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get("/api/workers");
        const data = Array.isArray(res.data) ? res.data : res.data.workers || [];
        setWorkers(data);
      } catch (err) {
        console.error("Failed to fetch workers:", err);
        setError("Unable to load workers.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  if (loading) return <p>Loading workers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="tab-container">
      <h2>Available Workers</h2>
      {workers.length === 0 ? (
        <p>No workers found.</p>
      ) : (
        <ul>
          {workers.map((w) => (
            <li key={w.id}>
              <strong>{w.name}</strong> – {w.skill} ({w.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Workers;
