import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserSettings = () => {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    axios.get("/api/users/me").then((res) => setUser(res.data));
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("/api/users/me", user);
      toast.success("Settings updated!");
    } catch {
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="tab-container">
      <h2>Settings</h2>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserSettings;
