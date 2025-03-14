const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { specs, swaggerUi } = require('./config/swagger');

// 쿠키 파서 미들웨어 추가
const cookieParser = require('cookie-parser');

// Express 앱 초기화
const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 쿠키 파싱
app.use(cookieParser());


// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// 라우트 등록
const categoryRoutes = require('./category/category.routes');
const productRoutes = require('./product/product.routes');
const authRoutes = require('./auth/auth.routes');
const optionTypeRoutes = require('./optionType/optionType.routes');
const cartRoutes = require('./cart/cart.routes');
const orderRoutes = require('./order/order.routes');
const adminRoutes = require('./admin/admin.routes');
const userRoutes = require('./user/user.routes');
const addressRoutes = require('./address/address.routes');
const reviewRoutes = require('./review/review.routes');
const wishlistRoutes = require('./wishlist/wishlist.routes');
const searchRoutes = require('./search/search.routes');
const trackingRoutes = require('./tracking/tracking.routes');
const inquiryRoutes = require('./inquiry/inquiry.routes');

app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/option-types', optionTypeRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/addresses', addressRoutes);
app.use('/reviews', reviewRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/search', searchRoutes);
app.use('/tracking', trackingRoutes);
app.use('/inquiries', inquiryRoutes);

// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: 'WHOISWATASHI API 서버가 실행 중입니다.' });
});

module.exports = app;