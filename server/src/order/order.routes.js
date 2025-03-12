const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 주문 생성
router.post('/',authMiddleware.isAuthenticated,orderController.createOrder);

// 비회원 주문 조회
router.post('/guest', orderController.getGuestOrder);

// PortOne 결제 검증
router.post('/verify/portone', orderController.verifyPortOnePayment);

// 주문 취소
router.post('/:id/cancel', authMiddleware.isAuthenticated, orderController.cancelOrder);

// 주문 상세 조회
router.get('/:id', authMiddleware.isAuthenticated, orderController.getOrderDetails);

// 사용자 주문 목록 조회
router.get('/', authMiddleware.isAuthenticated, orderController.getUserOrders);

module.exports = router;