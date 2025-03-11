const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 장바구니 조회
router.get('/', cartController.getCart);

// 장바구니에 상품 추가
router.post('/items', cartController.addToCart);

// 장바구니 아이템 수량 변경
router.put('/items/:cartItemId', cartController.updateCartItem);

// 장바구니 아이템 삭제
router.delete('/items/:cartItemId', cartController.removeCartItem);

// 장바구니 비우기
router.delete('/', cartController.clearCart);

module.exports = router;