import React from 'react';
import { AudioLines } from 'lucide-react'
import './Logo.css';

const Logo = () => {
    return (
      <div className="logo">
        <div className="logo-icon">
          <AudioLines />
        </div>
        <div className="logo-text">
            <div className="logo-text-main">
                <span className="logo-text-primary">PS</span>
                <span className="logo-text-secondary">music</span>
            </div>
            <p className="logo-text-subtitle">MXH ÂM NHẠC</p>
        </div>
      </div>
    );
};

export default Logo;