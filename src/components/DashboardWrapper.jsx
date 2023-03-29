import React from "react";
import { Link } from "react-router-dom";

const DashboardWrapper = ({ children }) => {
  return (
    <div>
      <nav>
        <div>Logotipo</div>
        <Link to="/dashboard">Links</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/dashboard">Signout</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
};

export default DashboardWrapper;
