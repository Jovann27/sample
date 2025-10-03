  import { useState } from "react";
  import axios from "axios";
  import toast from "react-hot-toast";

  const PlaceOrder = () => {
    const [service, setService] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post("/api/orders", { service, details });
        toast.success("Order placed successfully!");
        setService("");
        setDetails("");
      } catch (err) {
        toast.error("Failed to place order");
      }
    };

    return (
      <div className="tab-container">
        <h2>Place Order</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Service Name"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          />
          <textarea
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
          <button type="submit">Submit Order</button>
        </form>
      </div>
    );
  };

  export default PlaceOrder;
