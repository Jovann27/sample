import { useState } from "react";
import toast from "react-hot-toast";
import "./admin.css";

const JobFairCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    bannerImage: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("bannerImage", form.bannerImage);

      const res = await fetch("http://localhost:4000/api/v1/admin/jobfairs", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Job fair created successfully!");
        setForm({ title: "", description: "", date: "", location: "", bannerImage: null });
      } else {
        toast.error(data.message || "Failed to create job fair");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create Job Fair</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Banner Image</label>
          <input
            type="file"
            name="bannerImage"
            accept="image/*"
            onChange={(e) => setForm({ ...form, bannerImage: e.target.files[0] })}
            className="w-full border p-2 rounded"
            required
          />
          <div className="preview-box mt-2">
            {form.bannerImage ? (
              <img
                src={URL.createObjectURL(form.bannerImage)}
                alt="Banner Preview"
                className="max-h-40 object-cover"
              />
            ) : (
              <span>No file</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Job Fair"}
        </button>
      </form>
    </div>
  );
};

export default JobFairCreate;
