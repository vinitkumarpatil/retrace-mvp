import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-group">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a1a2e"/>
              <path d="M8 10h6v2H10v8h4v2H8V10z" fill="#e8913a"/>
              <path d="M18 10h6v2h-4v2h3v2h-3v2h4v2h-6V10z" fill="#e8913a"/>
            </svg>
          </div>
          <div>
            <h1 className="logo-text">ReTrace</h1>
            <p className="logo-tagline">LOST CONTEXT RECOVERY ENGINE</p>
          </div>
        </div>
      </div>
    </header>
  );
}
