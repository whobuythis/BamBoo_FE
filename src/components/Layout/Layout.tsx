import type React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import "./Layout.css";

const Layout: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 