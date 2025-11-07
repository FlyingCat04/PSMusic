import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import Logo from '../Logo/Logo';
import './Footer.css';

const Footer = () => {
  const footerData = {
    company: {
      name: "PSMusic",
      description: "Nền tảng nghe nhạc trực tuyến hàng đầu với hàng triệu bài hát chất lượng cao.",
      phone: "(028) 1234 5678",
      email: "contact@psmusic.com"
    },
    support: [
      { name: "Hỗ trợ", url: "/support" },
      { name: "Điều khoản sử dụng", url: "/terms" },
      { name: "Chính sách bảo mật", url: "/privacy" },
      { name: "Liên hệ", url: "/contact" },
      { name: "Góp ý", url: "/feedback" }
    ],
    socialLinks: [
      { name: "Facebook", url: "https://facebook.com/psmusic", icon: <Facebook /> },
      { name: "Instagram", url: "https://instagram.com/psmusic", icon: <Instagram /> },
      { name: "YouTube", url: "https://youtube.com/psmusic", icon: <Youtube /> }
    ]
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section company-info">
            <Logo />
            <p className="company-description">{footerData.company.description}</p>
            <div className="contact-info">
              <p><Phone className="contact-icon" /> {footerData.company.phone}</p>
              <p><Mail className="contact-icon" /> {footerData.company.email}</p>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Hỗ trợ</h4>
            <ul className="footer-links">
              {footerData.support.map((item, index) => (
                <li key={index}>
                  <a href={item.url}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h4 className="footer-title">Kết nối với chúng tôi</h4>
            <div className="social-links">
              {footerData.socialLinks.map((social, index) => (
                <a key={index} href={social.url} className="social-link" title={social.name}>
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 PSMusic. Tất cả quyền (không) được bảo lưu.</p>
            <p>Phát triển bởi Team PSMusic với tất cả tâm huyết!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;