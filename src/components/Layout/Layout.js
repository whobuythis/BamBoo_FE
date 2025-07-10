import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

import { Outlet } from 'react-router-dom';

import styles from './Layout.module.css';

function Layout({title, footermessage, menu_list}) {
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