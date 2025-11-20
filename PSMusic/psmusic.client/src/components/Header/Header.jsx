import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown';
import UserDropdown from '../UserDropdown/UserDropdown';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import styles from './Header.module.css';
import axiosInstance from '../../services/axiosInstance';

const Header = () => {
  const { user } = useAuth();
  const [avatarURL, setAvatarURL] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const result = await userService.getUserById(user.id);
        if (result.isSuccess && result.data?.avatarURL) {
          setAvatarURL(result.data.avatarURL);
          setAvatarError(false);
        } else {
          setAvatarURL(null);
          setAvatarError(true);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleImageError = () => {
    setAvatarError(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles['header-left']}>
        <div className={styles['navigation-arrows']}>
          <button className={`${styles['nav-arrow']}`} onClick={goPrev}>
            <ChevronLeft />
          </button>

          <button className={styles['nav-arrow']} onClick={goNext}>
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className={styles['search-bar']}>
        <div className={styles['search-icon']}>
          <Search />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
        />
      </div>
      <div className={styles['header-right']}>
        <SettingsDropdown />
        
        <UserDropdown 
          avatarURL={avatarURL}
          avatarError={avatarError}
          handleImageError={handleImageError}
        />

        {/* <button className={`${styles['header-button']} ${styles.primary}`}>
          Đăng nhập
        </button>
        <button className={`${styles['header-button']} ${styles.secondary}`}>
          <span>Tạo tài khoản</span>
        </button> */}

      </div>
    </header>
  );
};

export default Header;
