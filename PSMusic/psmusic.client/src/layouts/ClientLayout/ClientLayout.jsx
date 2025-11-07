import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './ClientLayout.module.css';

const ClientLayout = ({ children }) => {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <div className={styles.appBody}>
        <Header />
        <main className={styles.mainContent}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout;