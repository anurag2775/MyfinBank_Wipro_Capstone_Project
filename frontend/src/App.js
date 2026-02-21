import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import DepositWithdraw from "./pages/DepositWithdraw";
import Transfer from "./pages/Transfer";
import EmiCalculator from "./pages/EmiCalculator";
import ApplyLoan from "./pages/ApplyLoan";
import Investments from "./pages/Investments";
import Chat from "./pages/Chat";



import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminLoans from "./pages/AdminLoans";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // Listen for auth state changes to update state when login happens
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    // Listen for custom auth state change events (from login/logout)
    window.addEventListener("authStateChange", handleAuthChange);
    // Also listen for storage events (for cross-tab changes)
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authStateChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="mt-1"></div>
      <Routes>
        {/* These routes are open to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes for logged-in users */}
        <Route
          path="/user"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <UserDashboard /> : <Navigate to="/" />}
        />
        <Route
           path="/chat"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <Chat /> : <Navigate to="/" />}
        />
        <Route
          path="/deposit"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <DepositWithdraw /> : <Navigate to="/" />}
        />
        <Route
          path="/transfer"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <Transfer /> : <Navigate to="/" />}
        />
        <Route
          path="/emi"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <EmiCalculator /> : <Navigate to="/" />}
        />
        <Route
          path="/apply-loan"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <ApplyLoan /> : <Navigate to="/" />}
        />
        <Route
          path="/investments"
          element={!token ? <Navigate to="/login" /> : role === "user" ? <Investments /> : <Navigate to="/" />}
        />

        {/* Admin-only routes go here */}
        <Route
          path="/admin"
          element={!token ? <Navigate to="/login" /> : role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/chat"
          element={!token ? <Navigate to="/login" /> : role === "admin" ? <Chat /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/users"
          element={!token ? <Navigate to="/login" /> : role === "admin" ? <AdminUsers /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/loans"
          element={!token ? <Navigate to="/login" /> : role === "admin" ? <AdminLoans /> : <Navigate to="/" />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
