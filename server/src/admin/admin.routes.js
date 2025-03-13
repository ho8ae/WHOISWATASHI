const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { isAdmin } = require('../middleware/auth.middleware'); // 경로가 다를 수 있으니 확인 필요
const { body, param, query } = require('express-validator');
const { validationMiddleware } = require('../middleware/validation.middleware');

// 모든 라우트에 관리자 권한 확인 미들웨어 적용
router.use(isAdmin);

// 대시보드
router.get('/admin/dashboard', adminController.getDashboardStats);

// 사용자 관리
router.get('/admin/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('role').optional().isIn(['customer', 'admin']),
  validationMiddleware
], adminController.getAllUsers);

router.get('/admin/users/:id', [
  param('id').isInt(),
  validationMiddleware
], adminController.getUserDetails);

router.patch('/admin/users/:id/role', [
  param('id').isInt(),
  body('role').isIn(['customer', 'admin']),
  validationMiddleware
], adminController.updateUserRole);

// 주문 관리
router.get('/admin/orders', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
  query('search').optional().isString(),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
  validationMiddleware
], adminController.getAllOrders);

router.patch('/admin/orders/:id', [
  param('id').isInt(),
  body('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
  body('trackingNumber').optional().isString(),
  // null 허용하는 custom 유효성 검사로 변경
  body('shippedAt').optional().custom(value => {
    if (value === null) return true;
    if (new Date(value).toString() === 'Invalid Date') {
      throw new Error('유효한 날짜 형식이 아닙니다');
    }
    return true;
  }),
  body('notes').optional(),
  validationMiddleware
], adminController.updateOrder);

// 재고 관리
router.get('/admin/products/out-of-stock', adminController.getOutOfStockProducts);

router.patch('/admin/products/variants/:id/stock', [
  param('id').isInt(),
  body('stock').isInt({ min: 0 }),
  validationMiddleware
], adminController.updateProductStock);

module.exports = router;