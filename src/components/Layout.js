import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Sidebar from "./Layout/Sidebar";

import { Outlet, UNSAFE_decodeViaTurboStream } from "react-router-dom";

import styles from "./Layout/Layout.module.css";

function Layout({ title, footermessage, menu_list }) {
  return (
    <div>
      <Header title={title} />
      <div className={styles.page}>
        <Sidebar menu_list={menu_list} styles={styles} />
        <Outlet />
      </div>
      <Footer message={footermessage} />
    </div>
  );
}

export default Layout;
