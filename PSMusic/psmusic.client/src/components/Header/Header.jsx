import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown';
import { useNavigate } from 'react-router-dom'; 
import styles from './Header.module.css';

const Header = () => {

    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };
  return (
    <header className={styles.header}>
      <div className={styles['header-left']}>
        <div className={styles['navigation-arrows']}>
          <button className={`${styles['nav-arrow']} ${styles.disabled}`}>
            <ChevronLeft />
          </button>
          <button className={styles['nav-arrow']}>
            <ChevronRight />
          </button>
        </div>
        <div className={styles['search-bar']}>
          <div className={styles['search-icon']}>
            <Search />
           </div>
          <input
            type="text"
            placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className={styles['header-right']}>
        <SettingsDropdown />
        
        {/* <div className={styles['user-avatar']}>
            <User />
        </div> */}

        <button className={`${styles['header-button']} ${styles.primary}`}>
          Đăng nhập
        </button>
        <button className={`${styles['header-button']} ${styles.secondary}`}>
          <span>Tạo tài khoản</span>
        </button>

      </div>
    </header>
  );
};

export default Header;
