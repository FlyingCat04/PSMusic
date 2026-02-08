import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disc3, LayoutGrid, BarChart3, BookHeart, Heart } from 'lucide-react';
import Logo from '../Logo/Logo';
import styles from './Sidebar.module.css';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../Modal/AuthModal';
import { useTranslation } from 'react-i18next';

const mainNavItems = [
  { icon: <Disc3 />, label: 'discover', path: '/discover' },
  { icon: <LayoutGrid />, label: 'genres', path: '/genres' },
  { icon: <BarChart3 />, label: 'charts', path: '/charts' },
  { icon: <BookHeart />, label: 'for_you', path: '/for-you' },
  { icon: <Heart />, label: 'favorites', path: '/favorites', protected: true },
];

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/discover') {
      return location.pathname === '/' || location.pathname === '/discover';
    }
    return location.pathname === path;
  };

  const handleItemClick = (e, item) => {
    if (item.protected && !user) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <Logo />

      <nav className={styles['sidebar-nav']}>
        <ul>
          {mainNavItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`${styles['nav-item']} ${isActive(item.path) ? styles.active : ''}`}
                onClick={(e) => handleItemClick(e, item)}
              >
                <span className={styles['nav-item-icon']}>{item.icon}</span>
                <span className={styles['nav-item-label']}>{t(item.label)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;