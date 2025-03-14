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

module.exports = router;