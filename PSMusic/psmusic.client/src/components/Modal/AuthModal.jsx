import React, { useEffect } from 'react';
import { Music, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, onStopMusic }) => {
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

        <h1 className={styles.title}>Bắt đầu nghe nhạc</h1>
        <p className={styles.description}>
          Đăng nhập bằng tài khoản của bạn để khám phá đầy đủ các tính năng yêu thích và đánh giá bài hát.
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.loginBtn} onClick={handleLoginRedirect}>
            Đăng nhập ngay
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;