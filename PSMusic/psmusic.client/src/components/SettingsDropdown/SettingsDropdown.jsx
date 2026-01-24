import React, { useState, useRef, useEffect } from 'react';
import { Settings, Globe, Palette } from 'lucide-react';
import styles from './SettingsDropdown.module.css';

const SettingsDropdown = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('ruby');
    const dropdownRef = useRef(null);

    const themes = {
        ruby: {
            '--background-dark': '#161012',
            '--background-main': '#1c1417',
            '--sidebar-bg': '#23181c',
            '--component-bg': '#2c1e23',
            '--component-hover-bg': '#3a272d',
            '--primary-purple': '#e94560',
            '--primary-purple-hover': '#d7374e',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d8d8d8',
            '--text-tertiary': '#b9b9b9',
            '--border-color': '#4b3a3f',
            '--premium-yellow': '#f1c40f',
            '--live-red': '#ff3b3b',
        },
        amethyst: {
            '--background-dark': '#130f18',
            '--background-main': '#191321',
            '--sidebar-bg': '#201a2a',
            '--component-bg': '#281f34',
            '--component-hover-bg': '#342845',
            '--primary-purple': '#9b4de0',
            '--primary-purple-hover': '#8a44d0',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d8d8d8',
            '--text-tertiary': '#b9b9b9',
            '--border-color': '#45375a',
            '--premium-yellow': '#f5d442',
            '--live-red': '#e53935'
        },
        sapphire: {
            '--background-dark': '#0b0f13',
            '--background-main': '#101820',
            '--sidebar-bg': '#13212d',
            '--component-bg': '#162a38',
            '--component-hover-bg': '#1b3444',
            '--primary-purple': '#00b4ff',
            '--primary-purple-hover': '#00a0e6',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d8d8d8',
            '--text-tertiary': '#b9b9b9',
            '--border-color': '#2c3e50',
            '--premium-yellow': '#f5b301',
            '--live-red': '#ff4d4d'
        },
        emerald: {
            '--background-dark': '#0e1311',
            '--background-main': '#131a17',
            '--sidebar-bg': '#18221d',
            '--component-bg': '#1e2c25',
            '--component-hover-bg': '#274135',
            '--primary-purple': '#00c896',
            '--primary-purple-hover': '#00b383',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d8d8d8',
            '--text-tertiary': '#b9b9b9',
            '--border-color': '#3c5c52',
            '--premium-yellow': '#f5c542',
            '--live-red': '#e94560'
        },
        topaz: {
            '--background-dark': '#181410',
            '--background-main': '#201b14',
            '--sidebar-bg': '#2a231a',
            '--component-bg': '#332b21',
            '--component-hover-bg': '#403528',
            '--primary-purple': '#f5b301',
            '--primary-purple-hover': '#e6a001',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d8d8d8',
            '--text-tertiary': '#b9b9b9',
            '--border-color': '#4f3f2b',
            '--premium-yellow': '#ffd54f',
            '--live-red': '#e53935'
        },
        aquamarine: {
            '--background-dark': '#0c1011',
            '--background-main': '#111618',
            '--sidebar-bg': '#182024',
            '--component-bg': '#1f2a2d',
            '--component-hover-bg': '#283438',
            '--primary-purple': '#00adb5',
            '--primary-purple-hover': '#009aa0',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d8d8d8',
            '--text-tertiary': '#b9b9b9',
            '--border-color': '#334044',
            '--premium-yellow': '#f8d210',
            '--live-red': '#ff1744'
        }
    };

    const applyTheme = (theme) => {
        if (themes[theme]) {
            const root = document.documentElement;
            Object.entries(themes[theme]).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        
            localStorage.setItem('selectedTheme', theme);
            setCurrentTheme(theme); // Cập nhật state để theo dõi theme hiện tại
        }
    };

    // Lưu theme khi component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && themes[savedTheme]) {
            applyTheme(savedTheme);
        } else {
            // Nếu không có theme được lưu, sử dụng theme mặc định
            setCurrentTheme('ruby');
        }
    }, []);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = (language) => {
        // Thêm logic xử lý đổi ngôn ngữ ở đây
        setIsSettingsOpen(false);
    };

    const handleThemeChange = (theme) => {
        applyTheme(theme);
        setIsSettingsOpen(false);
    };

    return (
        <div className={styles['settings-dropdown']} ref={dropdownRef}>
            <button 
                className={styles['icon-button']}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
                <Settings />
            </button>
        
            {isSettingsOpen && (
                <div className={styles['dropdown-menu']}>                
                <div className={styles['dropdown-section']}>
                    <div className={styles['dropdown-header']}>
                        <Palette size={16} />
                        <span>Màu nền</span>
                    </div>
                    <div className={styles['dropdown-options']}>
                        <button 
                            className={`${styles['dropdown-option']} ${styles['theme-option']} ${currentTheme === 'ruby' ? styles.active : ''}`}
                            onClick={() => handleThemeChange('ruby')}
                        >
                            <div className={`${styles['theme-preview']} ${styles['ruby-theme']}`}></div>
                            <span>Ruby</span>
                        </button>
                        <button 
                            className={`${styles['dropdown-option']} ${styles['theme-option']} ${currentTheme === 'amethyst' ? styles.active : ''}`}
                            onClick={() => handleThemeChange('amethyst')}
                        >
                            <div className={`${styles['theme-preview']} ${styles['amethyst-theme']}`}></div>
                            <span>Amethyst</span>
                        </button>
                        <button 
                            className={`${styles['dropdown-option']} ${styles['theme-option']} ${currentTheme === 'sapphire' ? styles.active : ''}`}
                            onClick={() => handleThemeChange('sapphire')}
                        >
                            <div className={`${styles['theme-preview']} ${styles['sapphire-theme']}`}></div>
                            <span>Sapphire</span>
                        </button>
                        <button 
                            className={`${styles['dropdown-option']} ${styles['theme-option']} ${currentTheme === 'emerald' ? styles.active : ''}`}
                            onClick={() => handleThemeChange('emerald')}
                        >
                            <div className={`${styles['theme-preview']} ${styles['emerald-theme']}`}></div>
                            <span>Emerald</span>
                        </button>
                        <button 
                            className={`${styles['dropdown-option']} ${styles['theme-option']} ${currentTheme === 'topaz' ? styles.active : ''}`}
                            onClick={() => handleThemeChange('topaz')}
                        >
                            <div className={`${styles['theme-preview']} ${styles['topaz-theme']}`}></div>
                            <span>Topaz</span>
                        </button>
                        <button 
                            className={`${styles['dropdown-option']} ${styles['theme-option']} ${currentTheme === 'aquamarine' ? styles.active : ''}`}
                            onClick={() => handleThemeChange('aquamarine')}
                        >
                            <div className={`${styles['theme-preview']} ${styles['aquamarine-theme']}`}></div>
                            <span>Aquamarine</span>
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default SettingsDropdown;