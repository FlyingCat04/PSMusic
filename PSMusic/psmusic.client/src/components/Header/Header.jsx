import React from 'react';
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="navigation-arrows">
          <button className="nav-arrow disabled">
            <ChevronLeft />
          </button>
          <button className="nav-arrow">
            <ChevronRight />
          </button>
        </div>
        <div className="search-bar">
          <div className="search-icon">
            <Search />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
          />
        </div>
      </div>
      <div className="header-right">
        <SettingsDropdown />
        
        {/* <div className="user-avatar">
            <User />
        </div> */}

        <button className="header-button primary">
          Đăng nhập
        </button>
        <button className="header-button secondary">
          <span>Tạo tài khoản</span>
        </button>

      </div>
    </header>
  );
};

export default Header;
