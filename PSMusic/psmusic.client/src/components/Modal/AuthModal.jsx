import React, { useEffect } from 'react';
import { Music, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, onStopMusic }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    if (onStopMusic) onStopMusic();
    onClose();
    navigate('/auth');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.iconCircle}>
          <Music size={35} className={styles.musicIcon} />
        </div>

        <h1 className={styles.title}>{t('start_listening')}</h1>
        <p className={styles.description}>
          {t('auth_modal_desc')}
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.loginBtn} onClick={handleLoginRedirect}>
            {t('login_now')}
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            {t('maybe_later')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;