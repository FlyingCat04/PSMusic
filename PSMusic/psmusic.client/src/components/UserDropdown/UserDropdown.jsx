import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Music, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './UserDropdown.module.css';
import { useTranslation } from 'react-i18next';

const UserDropdown = ({ avatarURL, avatarError, handleImageError }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <div className={styles['user-dropdown']} ref={dropdownRef}>
            <button
                className={styles['user-avatar']}
                onClick={() => setIsOpen(!isOpen)}
            >
                {avatarURL && !avatarError ? (
                    <img
                        src={avatarURL}
                        alt="User avatar"
                        className={styles['avatar-image']}
                        onError={handleImageError}
                    />
                ) : (
                    <div className={styles['avatar-placeholder']}>
                        <User />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className={styles['dropdown-menu']}>
                    <div className={styles['user-info']}>
                        <div className={styles['user-avatar-small']}>
                            {avatarURL && !avatarError ? (
                                <img
                                    src={avatarURL}
                                    alt="User avatar"
                                    className={styles['avatar-image']}
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className={styles['avatar-placeholder-small']}>
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                        <div className={styles['user-details']}>
                            <span className={styles['display-name']}>{user?.displayName || 'User'}</span>
                        </div>
                    </div>

                    <div className={styles['dropdown-divider']}></div>

                    <div className={styles['dropdown-options']}>
                        <Link to="/favorites" className={styles['dropdown-option']}>
                            <Heart size={18} />
                            <span>{t('favorite_playlist_title')}</span>
                        </Link>
                        <button
                            className={`${styles['dropdown-option']} ${styles['logout']}`}
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default UserDropdown;
