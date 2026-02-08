import React from 'react';
import { Link } from 'react-router-dom';
import { AudioLines } from 'lucide-react'
import styles from './Logo.module.css';
import { useTranslation } from 'react-i18next';

const Logo = () => {
  const { t } = useTranslation();
  return (
    <Link to="/" className={styles.logo}>
      <div className={styles['logo-icon']}>
        <AudioLines />
      </div>
      <div className={styles['logo-text']}>
        <div className={styles['logo-text-main']}>
          <span className={styles['logo-text-primary']}>PS</span>
          <span className={styles['logo-text-secondary']}>music</span>
        </div>
        <p className={styles['logo-text-subtitle']}>{t('logo_subtitle')}</p>
      </div>
    </Link>
  );
};

export default Logo;