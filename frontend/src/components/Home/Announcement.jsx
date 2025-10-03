import { useEffect, useState } from "react";
import "./announcement.css";

const Announcement = () => {
  const [jobfair, setJobfair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobfair = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/settings/jobfair");
        const data = await res.json();
        if (data.success) {
          setJobfair(data.jobfair);
        } else {
          setError("Failed to fetch job fair details");
        }
      } catch (err) {
        setError("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobfair();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!jobfair) return <div>No job fair found.</div>;

  return (
    <div className="jobfair-announcement">
      <img
        src={
          jobfair.bannerImage
            ? // If bannerImage is an absolute URL (Cloudinary secure_url), use it directly.
              // Otherwise assume it's a filename stored in backend uploads and prepend the uploads path.
              jobfair.bannerImage.startsWith("http")
              ? jobfair.bannerImage
              : `http://localhost:4000/uploads/${jobfair.bannerImage}`
            : "placeholder.jpg"
        }
        alt="Job Fair Banner"
        className="banner-image"
      />
      <h3>{jobfair.title}</h3>
      <p><strong>Description:</strong> {jobfair.description}</p>
      <p><strong>Date:</strong> {new Date(jobfair.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {jobfair.location}</p>
    </div>
  );
};

export default Announcement;
