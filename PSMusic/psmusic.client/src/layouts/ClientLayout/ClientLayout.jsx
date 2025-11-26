import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import styles from './ClientLayout.module.css';
import PlayerControl from "../../components/PlayerControl/PlayerControl";
import { usePlayer } from "../../contexts/PlayerContext";
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
   const { isPlayerVisible } = usePlayer();
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
    {isPlayerVisible && (
        <div className={styles.playerWrapper}>
            <PlayerControl />
        </div>
    )}
    </div>
  );
};

export default ClientLayout;