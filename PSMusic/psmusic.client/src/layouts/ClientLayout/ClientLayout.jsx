import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './ClientLayout.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import PlayerControl from '../../components/PlayerControl/PlayerControl';
import { usePlayer } from '../../contexts/PlayerContext';
import { Toaster } from 'react-hot-toast';

const ClientLayout = () => {
    const { isPlayerVisible } = usePlayer();
    const location = useLocation();
    const isMusicPlayerPage = location.pathname.startsWith('/player');

  return (
    <div className={styles.appLayout}>
      <Toaster 
          position="top-right" 
          containerStyle={{
              top: '75px',
              zIndex: 99999,
          }}
          toastOptions={{
              style: {
                  background: '#fff',
                  color: '#000',
              },
          }}
      />
      <Sidebar />
      <div className={styles.appBody}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
        <Footer />
        {isPlayerVisible && !isMusicPlayerPage && <PlayerControl />}
      </div>
    {isPlayerVisible && (
        <div className={styles.playerWrapper}>
            <PlayerControl />
        </div>
    )}
    </div>
  );
};

export default ClientLayout;