import { Link } from "react-router-dom";

const UserSidebar = () => (
  <div className="sidebar">
    <ul>
      <li><Link to="/user/place-order">Place Order</Link></li>
      <li><Link to="/user/records">My Records</Link></li>
      <li><Link to="/user/workers">Workers</Link></li>
      <li><Link to="/user/settings">Settings</Link></li>
      <li><Link to="/user/help">Help</Link></li>
    </ul>
  </div>
);

export default UserSidebar;
