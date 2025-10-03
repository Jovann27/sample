import { useEffect, useState } from "react";
import "./service.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;
  if (users.length === 0) return <div>No users found.</div>;

  return (
    
    <div className="users-list">
      <h2>👥 All Users ({users.length})</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="profile-pic"
                />
              </td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.verified ? "✅ Yes" : "❌ No"}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
