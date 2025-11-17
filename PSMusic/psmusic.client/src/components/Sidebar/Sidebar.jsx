import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disc3, LayoutGrid, BarChart3, BookHeart, Heart, History, Plus } from 'lucide-react';
import Logo from '../Logo/Logo';
import styles from './Sidebar.module.css';

const mainNavItems = [
  { icon: <Disc3 />, label: 'Khám Phá', path: '/discover' },
  { icon: <LayoutGrid />, label: 'Chủ Đề & Thể Loại', path: '/genres' },
  { icon: <BarChart3 />, label: 'Bảng Xếp Hạng', path: '/charts' },
  { icon: <BookHeart />, label: 'Dành cho bạn', path: '/for-you' },
];

const secondaryNavItems = [
  { icon: <Heart />, label: 'Bài Hát Yêu Thích', path: '/favorites' },
  { icon: <History />, label: 'Nghe Gần Đây', path: '/recent' },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/discover') {
      return location.pathname === '/' || location.pathname === '/discover';
    }
    return location.pathname === path;
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
              >
                <span className={styles['nav-item-icon']}>{item.icon}</span>
                <span className={styles['nav-item-label']}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles['sidebar-nav-title']}>Thư Viện</div>

      <nav className={styles['sidebar-nav']}>
        <ul>
          {secondaryNavItems.map((item, index) => (
             <li key={index}>
              <Link 
                to={item.path} 
                className={`${styles['nav-item']} ${location.pathname === item.path ? styles.active : ''}`}
              >
                <span className={styles['nav-item-icon']}>{item.icon}</span>
                <span className={styles['nav-item-label']}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles['sidebar-nav-title']}>Playlist</div>
      {/* <div className={styles['login-prompt']}>
        <p>Đăng nhập để khám phá playlist dành riêng cho bạn</p>
        <button className={styles['login-button']}>
          ĐĂNG NHẬP
        </button>
      </div> */}

      {/* <button className={styles['add-playlist-button']}>
        <Plus />
        <span>Tạo playlist mới</span>
      </button> */}
    </aside>
  );
};

export default Sidebar;
