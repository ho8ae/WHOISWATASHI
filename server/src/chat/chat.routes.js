const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

// 내 채팅 목록 조회
router.get('/my', isAuthenticated, chatController.getMyChats);

// 관리자: 모든 채팅 목록 조회
router.get('/admin', isAuthenticated, isAdmin, chatController.getAllChats);

// 채팅 상세 조회
router.get('/:id', isAuthenticated, chatController.getChatById);

// 채팅 메시지 목록 조회
router.get('/:id/messages', isAuthenticated, chatController.getChatMessages);

// 새 채팅 생성
router.post('/', isAuthenticated, chatController.createChat);

// 메시지 전송
router.post('/:id/messages', isAuthenticated, chatController.sendMessage);

// 채팅 상태 변경
router.patch('/:id/status', isAuthenticated, chatController.updateChatStatus);

// 관리자 배정 (관리자만 가능)
router.patch('/:id/assign', isAuthenticated, isAdmin, chatController.assignAdmin);


// 오래된 채팅 정리 (관리자용)
router.post('/cleanup', isAuthenticated, isAdmin, chatController.cleanupOldChats);

// 읽지 않은 메시지 수 조회
router.get('/unread-count', isAuthenticated, chatController.getUnreadCount);

module.exports = router;