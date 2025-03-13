const express = require('express');
const router = express.Router();
const trackingController = require('./tracking.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');
const { validationMiddleware } = require('../middleware/validation.middleware');
const {
  orderIdParamValidation,
  updateOrderStatusValidation,
  updateTrackingInfoValidation
} = require('./tracking.validation');

// 주문 배송 상태 조회 (인증 필요)
router.get('/orders/:orderId', [
  isAuthenticated,
  ...orderIdParamValidation,
  validationMiddleware
], trackingController.getOrderTracking);

// 주문 상태 변경 내역 조회 (인증 필요)
router.get('/orders/:orderId/history', [
  isAuthenticated,
  ...orderIdParamValidation,
  validationMiddleware
], trackingController.getOrderStatusHistory);

// 이하 관리자 전용 API
router.use(isAdmin);

// 주문 상태 변경 (관리자 전용)
router.patch('/admin/orders/:orderId/status', [
  updateOrderStatusValidation,
  validationMiddleware
], trackingController.updateOrderStatus);

// 배송 추적 정보 업데이트 (관리자 전용)
router.patch('/admin/orders/:orderId/tracking', [
  updateTrackingInfoValidation,
  validationMiddleware
], trackingController.updateTrackingInfo);

module.exports = router;