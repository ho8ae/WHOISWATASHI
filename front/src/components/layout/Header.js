import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="navbar">
          <div className="navbar-brand">
            <Link to="/">WHOISWATASHI</Link>
          </div>
          
          <button className="mobile-menu-toggle">
            <i className="fas fa-bars"></i>
          </button>
          
          <nav className="navbar-nav">
            <div className="nav-item">
              <Link to="/products" className="nav-link">상품</Link>
            </div>
            <div className="nav-item">
              <Link to="/products/new" className="nav-link">신상품</Link>
            </div>
            <div className="nav-item">
              <Link to="/products/sale" className="nav-link">세일</Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link">브랜드 소개</Link>
            </div>
          </nav>
          
          <div className="navbar-actions">
            <button className="btn-icon">
              <i className="fas fa-search"></i>
            </button>
            <Link to="/cart" className="btn-icon">
              <i className="fas fa-shopping-cart"></i>
              <span className="badge">0</span>
            </Link>
            <Link to="/login" className="btn-icon">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;