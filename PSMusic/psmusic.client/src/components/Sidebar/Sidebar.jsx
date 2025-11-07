import React from 'react';
import { Disc3, LayoutGrid, BarChart3, BookHeart, Heart, History, Plus } from 'lucide-react';
import Logo from '../Logo/Logo';
import './Sidebar.css';

const mainNavItems = [
  { icon: <Disc3 />, label: 'Khám Phá', active: true },
  { icon: <LayoutGrid />, label: 'Chủ Đề & Thể Loại' },
  { icon: <BarChart3 />, label: 'Bảng Xếp Hạng' },
  { icon: <BookHeart />, label: 'Dành cho bạn' },
];

const secondaryNavItems = [
  { icon: <Heart />, label: 'Bài Hát Yêu Thích' },
  { icon: <History />, label: 'Nghe Gần Đây' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Logo />
      
      <nav className="sidebar-nav">
        <ul>
          {mainNavItems.map((item, index) => (
            <li key={index}>
              <a href="#" className={`nav-item ${item.active ? 'active' : ''}`}>
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {item.live && <span className="live-badge">LIVE</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-nav-title">Thư Viện</div>

      <nav className="sidebar-nav">
        <ul>
          {secondaryNavItems.map((item, index) => (
             <li key={index}>
              <a href="#" className="nav-item">
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-nav-title">Playlist</div>
      <div className="login-prompt">
        <p>Đăng nhập để khám phá playlist dành riêng cho bạn</p>
        <button className="login-button">
          ĐĂNG NHẬP
        </button>
      </div>

      {/* <button className="add-playlist-button">
        <Plus />
        <span>Tạo playlist mới</span>
      </button> */}
    </aside>
  );
};

export default Sidebar;
