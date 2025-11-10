import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

const Footer = () => {
  const footerData = {
    company: {
      name: "PSMusic",
      description: "Nền tảng nghe nhạc trực tuyến hàng đầu với hàng triệu bài hát chất lượng cao.",
      phone: "(028) 1234 5678",
      email: "psmusicofficial2025@gmail.com"
    },
    support: [
      { name: "Hỗ trợ", url: "/support" },
      { name: "Điều khoản sử dụng", url: "/terms" },
      { name: "Chính sách bảo mật", url: "/privacy" },
      { name: "Liên hệ", url: "/contact" },
      { name: "Góp ý", url: "/feedback" }
    ],
    socialLinks: [
      { name: "Facebook", url: "https://youtu.be/886d9rm_AFE?si=kTHUX8yEVxn4qmAg", icon: <Facebook /> },
      { name: "Instagram", url: "https://youtu.be/886d9rm_AFE?si=kTHUX8yEVxn4qmAg", icon: <Instagram /> },
      { name: "YouTube", url: "https://youtu.be/886d9rm_AFE?si=kTHUX8yEVxn4qmAg", icon: <Youtube /> }
    ]
  };

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles['footer-content']}>
          {/* Company Info */}
          <div className={`${styles['footer-section']} ${styles['company-info']}`}>
            <Logo />
            <p className={styles['company-description']}>{footerData.company.description}</p>
            <div className={styles['contact-info']}>
              <p><Phone className={styles['contact-icon']} /> {footerData.company.phone}</p>
              <p><Mail className={styles['contact-icon']} /> {footerData.company.email}</p>
            </div>
          </div>

          {/* Support */}
          <div className={styles['footer-section']}>
            <h4 className={styles['footer-title']}>Hỗ trợ</h4>
            <ul className={styles['footer-links']}>
              {footerData.support.map((item, index) => (
                <li key={index}>
                  <Link to={item.url}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className={styles['footer-section']}>
            <h4 className={styles['footer-title']}>Kết nối với chúng tôi</h4>
            <div className={styles['social-links']}>
              {footerData.socialLinks.map((social, index) => (
                <a key={index} href={social.url} className={styles['social-link']} title={social.name}>
                  <span className={styles['social-icon']}>{social.icon}</span>
                  <span className={styles['social-name']}>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles['footer-bottom']}>
          <div className={styles['footer-bottom-content']}>
            <p>&copy; 2025 PSMusic. Tất cả quyền (không) được bảo lưu.</p>
            <p>Phát triển bởi Team PSMusic với tất cả tâm huyết!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;