// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>WHOISWATASHI</h4>
            <p>최고의 품질로 최상의 서비스를 제공합니다.</p>
            <div className="social-links">
              <a href="#/" className="social-link"><i className="fab fa-facebook"></i></a>
              <a href="#/" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#/" className="social-link"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          
          <div className="col-md-2">
            <h4>쇼핑</h4>
            <ul className="footer-links">
              <li><Link to="/products">전체 상품</Link></li>
              <li><Link to="/products/new">신상품</Link></li>
              <li><Link to="/products/sale">세일</Link></li>
              <li><Link to="/products/best">베스트</Link></li>
            </ul>
          </div>
          
          <div className="col-md-2">
            <h4>고객지원</h4>
            <ul className="footer-links">
              <li><Link to="/faq">자주 묻는 질문</Link></li>
              <li><Link to="/inquiries">1:1 문의</Link></li>
              <li><Link to="/shipping">배송 안내</Link></li>
              <li><Link to="/returns">교환/반품 안내</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h4>고객센터</h4>
            <p>평일 10:00 - 18:00 (점심시간 12:00 - 13:00)</p>
            <p>주말 및 공휴일 휴무</p>
            <p>전화: 02-1234-5678</p>
            <p>이메일: support@whoiswatashi.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 WHOISWATASHI. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">이용약관</Link>
            <Link to="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;