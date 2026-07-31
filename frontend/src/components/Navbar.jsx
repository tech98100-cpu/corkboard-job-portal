import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  jobseeker: "/dashboard/seeker",
  employer: "/dashboard/employer",
  admin: "/dashboard/admin",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="felt" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="container" style={styles.bar}>
        <Link to="/" style={styles.brand}>
          <span style={styles.pin} />
          The Corkboard
        </Link>

        <nav style={styles.nav}>
          <Link to="/jobs" style={styles.link}>Browse Jobs</Link>

          {!user && (
            <>
              <Link to="/login" style={styles.link}>Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join the Board</Link>
            </>
          )}

          {user && (
            <>
              <Link to={dashboardPath[user.role]} style={styles.link}>
                {user.role === "admin" ? "Admin Desk" : user.role === "employer" ? "My Postings" : "My Applications"}
              </Link>
              <span className="meta" style={{ color: "#e6dfcb" }}>Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Log Out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  brand: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "1.35rem",
    color: "var(--card-cream)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pin: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 30%, #e77568, var(--pin-red) 65%)",
    display: "inline-block",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  link: {
    color: "var(--card-cream)",
    fontWeight: 500,
    fontSize: "0.95rem",
  },
};
