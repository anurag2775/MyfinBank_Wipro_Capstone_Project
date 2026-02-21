import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // If logged in but role does not match, redirect to home.
    // This prevents users from accessing admin pages and vice-versa.
    return <Navigate to="/" replace />;
  }

  // If logged in and role matches, render the component
  return children;
};

export default ProtectedRoute;