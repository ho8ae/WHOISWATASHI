const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Express 앱 초기화
const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 라우트 등록
const categoryRoutes = require('./category/category.routes');
app.use('/api/categories', categoryRoutes);
const productRoutes = require('./product/product.routes');
app.use('/api/products', productRoutes);


// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: '쇼핑몰 API 서버가 실행 중입니다.' });
});

module.exports = app;