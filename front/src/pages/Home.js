import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-image">
          <img src="/images/hero-placeholder.jpg" alt="쇼핑몰 메인 이미지" />
        </div>
        <div className="hero-content">
          <h1>WHOISWATASHI</h1>
          <p>당신을 위한 최고의 쇼핑 경험</p>
          <button className="btn btn-primary">쇼핑하기</button>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="categories-section">
        <div className="section-title">
          <h2>카테고리</h2>
        </div>
        <div className="category-list">
          <div className="category-item">
            <div className="category-image">
              <img src="/images/category-1.jpg" alt="카테고리 1" />
            </div>
            <div className="category-name">의류</div>
          </div>
          <div className="category-item">
            <div className="category-image">
              <img src="/images/category-2.jpg" alt="카테고리 2" />
            </div>
            <div className="category-name">신발</div>
          </div>
          <div className="category-item">
            <div className="category-image">
              <img src="/images/category-3.jpg" alt="카테고리 3" />
            </div>
            <div className="category-name">액세서리</div>
          </div>
          <div className="category-item">
            <div className="category-image">
              <img src="/images/category-4.jpg" alt="카테고리 4" />
            </div>
            <div className="category-name">가방</div>
          </div>
        </div>
      </section>

      {/* 인기 상품 섹션 */}
      <section className="featured-products">
        <div className="section-title">
          <h2>인기 상품</h2>
        </div>
        <div className="product-grid">
          {/* 상품 카드 1 */}
          <div className="product-card">
            <div className="product-image">
              <img src="/images/product-1.jpg" alt="제품 1" />
              <div className="product-badge">NEW</div>
              <div className="product-actions">
                <button className="btn btn-sm">장바구니</button>
                <button className="btn btn-sm">찜하기</button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-title">제품명 1</h3>
              <div className="product-price">
                <span className="sale-price">39,000원</span>
                <span className="original-price">45,000원</span>
              </div>
            </div>
          </div>
          
          {/* 상품 카드 2 */}
          <div className="product-card">
            <div className="product-image">
              <img src="/images/product-2.jpg" alt="제품 2" />
              <div className="product-actions">
                <button className="btn btn-sm">장바구니</button>
                <button className="btn btn-sm">찜하기</button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-title">제품명 2</h3>
              <div className="product-price">
                <span className="sale-price">28,000원</span>
              </div>
            </div>
          </div>
          
          {/* 상품 카드 3 */}
          <div className="product-card">
            <div className="product-image">
              <img src="/images/product-3.jpg" alt="제품 3" />
              <div className="product-badge">SALE</div>
              <div className="product-actions">
                <button className="btn btn-sm">장바구니</button>
                <button className="btn btn-sm">찜하기</button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-title">제품명 3</h3>
              <div className="product-price">
                <span className="sale-price">52,000원</span>
                <span className="original-price">65,000원</span>
              </div>
            </div>
          </div>
          
          {/* 상품 카드 4 */}
          <div className="product-card">
            <div className="product-image">
              <img src="/images/product-4.jpg" alt="제품 4" />
              <div className="product-actions">
                <button className="btn btn-sm">장바구니</button>
                <button className="btn btn-sm">찜하기</button>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-title">제품명 4</h3>
              <div className="product-price">
                <span className="sale-price">37,000원</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프로모션 섹션 */}
      <section className="promotion-section">
        <div className="promotion-card">
          <h3>신규 회원 10% 할인</h3>
          <p>지금 가입하고 첫 구매 시 10% 할인 혜택을 누려보세요!</p>
          <button className="btn btn-primary">회원가입</button>
        </div>
      </section>
    </div>
  );
};

export default Home;