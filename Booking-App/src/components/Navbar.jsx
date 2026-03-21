import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user, logout } = useContext(UserContext); // ✅ use logout, remove setUser
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropRef = useRef(null);

  // ✅ FIXED: user IS the user now — no more user?.user nesting
  const currentUser = user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = e => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout(); // ✅ one call — clears user, token, localStorage all at once
    navigate("/");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/rooms?city=${searchQuery.trim()}`);
  }

  const isActive = path => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">

        {/* ── LOGO ── */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 10.5L12 3l9 7.5V21H15v-6H9v6H3V10.5z" fill="#fff"/>
            </svg>
          </div>
          <span className="navbar__logo-name">StayEase</span>
        </Link>

        {/* ── SEARCH BAR (desktop) ── */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <span className="navbar__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search city, hotel..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="navbar__search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="navbar__search-clear"
              onClick={() => setSearchQuery("")}
            >✕</button>
          )}
        </form>

        {/* ── RIGHT ── */}
        <div className="navbar__right">

          {/* Nav Links */}
          <ul className="navbar__links">
            <li>
              <Link to="/"
                className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}>
                Explore
              </Link>
            </li>
            <li>
              <Link to="/rooms"
                className={`navbar__link ${isActive("/rooms") ? "navbar__link--active" : ""}`}>
                Rooms
              </Link>
            </li>
            {currentUser && (
              <li>
                <Link to="/my-bookings"
                  className={`navbar__link ${isActive("/my-bookings") ? "navbar__link--active" : ""}`}>
                  My Bookings
                </Link>
              </li>
            )}
          </ul>

          {/* Divider */}
          <div className="navbar__divider" />

          {/* Auth */}
          {currentUser ? (
            <div className="navbar__user" ref={dropRef}>
              <button
                className="navbar__user-btn"
                onClick={() => setDropOpen(p => !p)}
              >
                <div className="navbar__avatar">
                  {/* ✅ currentUser.username directly — no more currentUser.user.username */}
                  {currentUser.username?.charAt(0).toUpperCase()}
                </div>
                <span className="navbar__username">{currentUser.username}</span>
                <svg
                  className={`navbar__chevron ${dropOpen ? "navbar__chevron--open" : ""}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <div className="navbar__dropdown-avatar">
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="navbar__dropdown-name">{currentUser.username}</p>
                      <p className="navbar__dropdown-email">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/my-bookings" className="navbar__dropdown-item">
                    📋 My Bookings
                  </Link>
                  <Link to="/my-bookings" className="navbar__dropdown-item">
                    ❤️ Wishlist
                  </Link>
                  <div className="navbar__dropdown-divider" />
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--red"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/auth" className="navbar__login">Log in</Link>
              <Link to="/auth" className="navbar__signup">Sign up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="navbar__drawer">

          <form className="navbar__drawer-search" onSubmit={handleSearch}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search city, hotel..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <ul className="navbar__drawer-links">
            <li><Link to="/">🏠 Explore</Link></li>
            <li><Link to="/rooms">🛏️ Rooms</Link></li>
            {currentUser && (
              <li><Link to="/my-bookings">📋 My Bookings</Link></li>
            )}
            {currentUser ? (
              <>
                <li><Link to="/my-bookings">❤️ Wishlist</Link></li>
                <li>
                  <button
                    className="navbar__drawer-signout"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/auth">👤 Log In</Link></li>
                <li><Link to="/auth" className="navbar__drawer-signup">✨ Sign Up Free</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;