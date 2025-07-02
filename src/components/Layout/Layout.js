import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";

import styles from "./Layout.module.css";

function Layout({ title, footermessage }) {
  return (
    <div>
      <Header title={title} />
      <Outlet />
      <Footer message={footermessage} />
    </div>
  );
}

export default Layout;
