import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disc3, LayoutGrid, BarChart3, BookHeart, Heart } from 'lucide-react';
import Logo from '../Logo/Logo';
import styles from './Sidebar.module.css';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../Modal/AuthModal';

const mainNavItems = [
  { icon: <Disc3 />, label: 'Khám Phá', path: '/discover' },
  { icon: <LayoutGrid />, label: 'Chủ Đề & Thể Loại', path: '/genres' },
  { icon: <BarChart3 />, label: 'Bảng Xếp Hạng', path: '/charts' },
  { icon: <BookHeart />, label: 'Dành cho bạn', path: '/for-you', protected: true },
  { icon: <Heart />, label: 'Bài Hát Yêu Thích', path: '/favorites', protected: true },
];

const Sidebar = () => {
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
                <span className={styles['nav-item-label']}>{item.label}</span>
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