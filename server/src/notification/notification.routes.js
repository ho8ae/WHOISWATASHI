const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

// 사용자 알림 목록 조회
router.get('/', isAuthenticated, notificationController.getUserNotifications);

// 읽지 않은 알림 수 조회
router.get('/count', isAuthenticated, notificationController.getUnreadCount);

// 알림 읽음 처리
router.patch('/:id/read', isAuthenticated, notificationController.markAsRead);

// 모든 알림 읽음 처리
router.patch('/read-all', isAuthenticated, notificationController.markAllAsRead);

// 알림 삭제
router.delete('/:id', isAuthenticated, notificationController.deleteNotification);

// 관리자: 프로모션 알림 전송
router.post('/admin/promotion', isAuthenticated, isAdmin, notificationController.sendPromotionNotification);

module.exports = router;