import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = user?.user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    setUser(null);
    navigate("/");
  }

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">

        {/* LEFT — Logo */}
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo__icon">⬡</span>
            <span className="logo__text">StayEase</span>
          </Link>
        </div>

        {/* CENTER — Nav Links */}
        <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <li>
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>
          </li>
          <li>
            <Link to="/rooms" className="nav-link" onClick={() => setMenuOpen(false)}>
              Rooms
            </Link>
          </li>
          {currentUser && (
            <li>
              <Link to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
            </li>
          )}
        </ul>

        {/* RIGHT — User Actions */}
        <div className="nav-right">
          {currentUser ? (
            <div className="nav-user">
              <div className="user-pill">
                <span className="user-pill__avatar">
                  {currentUser.username?.charAt(0).toUpperCase()}
                </span>
                <span className="user-pill__name">{currentUser.username}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="login-btn">
              <span>Sign In</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;