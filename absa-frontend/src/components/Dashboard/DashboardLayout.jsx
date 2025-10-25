import React from "react";
import { FaTachometerAlt, FaChartBar, FaTable, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard-theme.css";

const sections = [
  { name: "Overview", icon: <FaTachometerAlt /> },
  { name: "Aspect Sentiment", icon: <FaChartBar /> },
  { name: "Recent Reviews", icon: <FaTable /> },
];

const DashboardLayout = ({ activeSection, setActiveSection, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // clear your auth/session info
    localStorage.removeItem("userId");
    navigate("/login"); // redirect to login page
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#1f2937",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <h1 style={{ padding: "20px", fontSize: "24px", borderBottom: "1px solid #374151" }}>
          ABSA
        </h1>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
          {sections.map((sec) => (
            <button
              key={sec.name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
                backgroundColor: activeSection === sec.name ? "#374151" : "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setActiveSection(sec.name)}
            >
              <span style={{ marginRight: "10px" }}>{sec.icon}</span>
              {sec.name}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            margin: "10px",
            borderRadius: "6px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <FaSignOutAlt style={{ marginRight: "10px" }} />
          Logout
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          backgroundColor: "#f3f4f6",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
