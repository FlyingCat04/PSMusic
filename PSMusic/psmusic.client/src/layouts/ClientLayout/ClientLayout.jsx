import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './ClientLayout.module.css';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <div className={styles.appBody}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout;