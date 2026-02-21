import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        {/* Logo + Brand */}
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="MyFin Bank"
            style={{ width: "70px", height: "70px", marginRight: "10px" }}
          />
          <span className="navbar-brand fw-bold fs-5">
            MyFin Bank
          </span>
        </div>

        {/* Navigation Links */}
        <div>
          <Link to="/" className="text-white me-4 text-decoration-none fs-5">
            Home
          </Link>

          {role === "user" ? (
            <>
              <Link to="/user" className="text-white me-4 text-decoration-none fs-5">
                Dashboard
              </Link>
              <span
                className="text-white text-decoration-none fs-5"
                style={{ cursor: "pointer" }}
                onClick={logout}
              >
                Logout
              </span>
            </>
          ) : role === "admin" ? (
            <>
              <Link to="/admin" className="text-white me-4 text-decoration-none fs-5">
                Admin
              </Link>
              <span
                className="text-white text-decoration-none fs-5"
                style={{ cursor: "pointer" }}
                onClick={logout}
              >
                Logout
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white me-4 text-decoration-none fs-5">
                Login
              </Link>
              <Link to="/register" className="text-white text-decoration-none fs-5">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;