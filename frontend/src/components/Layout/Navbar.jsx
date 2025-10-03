import { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useMainContext } from "../../mainContext";
import "./navbar.css";

const Navbar = () => {
  const { user, admin, isAuthorized } = useMainContext();
  const [show, setShow] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo_container">
          <div className="logo">
            <img
              src="https://i.ibb.co/MxKr7FVx/1000205778-removebg-preview.png"
              alt="logo"
            />
          </div>
          <div className="title">SkillConnect4B410</div>
        </div>

        {/* Menu */}
        <div className="menu-wrapper">
          <ul className={!show ? "menu" : "show-menu menu"}>
            {/* Always visible */}
            <li>
              <Link to="/">HOME</Link>
            </li>
            <li>
              <Link to="/about">ABOUT</Link>
            </li>

            {!isAuthorized && (
              <>
                <li>
                  <Link to="/login">LOGIN</Link>
                </li>
                <li>
                  <Link to="/register">REGISTER</Link>
                </li>
              </>
            )}

            {/* User Dashboard */}
            {user && (
              <li>
                <Link to="/user/dashboard">USER DASHBOARD</Link>
              </li>
            )}

            {/* Admin Dashboard */}
            {admin && (
              <li>
                <Link to="/admin/dashboard">ADMIN DASHBOARD</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
