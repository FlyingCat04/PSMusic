import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'vi', label: 'Tiếng Việt' },
        { code: 'en', label: 'English' },
        { code: 'jp', label: '日本語' },
        { code: 'ru', label: 'Русский' },
        { code: 'ger', label: 'Deutsch' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
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

    return (
        <div className={styles['language-dropdown']} ref={dropdownRef}>
            <button
                className={styles['icon-button']}
                onClick={() => setIsOpen(!isOpen)}
                title={t('language_switcher')}
            >
                <Globe size={20} />
            </button>

            {isOpen && (
                <div className={styles['dropdown-menu']}>
                    <div className={styles['dropdown-header']}>
                        <span>{t('language_switcher')}</span>
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles['dropdown-option']} ${i18n.language === lang.code ? styles.active : ''}`}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            <span>{lang.label}</span>
                            {i18n.language === lang.code && <Check size={16} className={styles['check-icon']} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
