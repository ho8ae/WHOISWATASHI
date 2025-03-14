const express = require('express');
const router = express.Router();
const inquiryController = require('./inquiry.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');
const {
  createInquiryValidation,
  updateInquiryValidation,
  createAnswerValidation,
  updateStatusValidation,
  accessPrivateValidation,
  listQueryValidation
} = require('./inquiry.validation');

// 문의글 목록 조회 (관리자)
router.get('/admin', isAuthenticated, isAdmin, listQueryValidation, inquiryController.getAllInquiries);

// 사용자 본인 문의글 목록 조회
router.get('/my', isAuthenticated, listQueryValidation, inquiryController.getMyInquiries);

// 문의글 작성
router.post('/',isAuthenticated ,createInquiryValidation, inquiryController.createInquiry);

// 문의글 상세 조회 (비공개 글인 경우 비밀번호 필요)
router.get('/:id', inquiryController.getInquiryById);
router.post('/:id/access', accessPrivateValidation, inquiryController.accessPrivateInquiry);

// 문의글 수정
router.put('/:id', isAuthenticated, updateInquiryValidation, inquiryController.updateInquiry);

// 문의글 삭제
router.delete('/:id', isAuthenticated, inquiryController.deleteInquiry);

// 관리자: 문의글 답변 작성
router.post('/admin/:id/answer', isAuthenticated, isAdmin, createAnswerValidation, inquiryController.answerInquiry);

// 관리자: 문의글 답변 수정
router.put('/admin/answer/:answerId', isAuthenticated, isAdmin, createAnswerValidation, inquiryController.updateAnswer);

// 관리자: 문의글 상태 변경
router.patch('/admin/:id/status', isAuthenticated, isAdmin, updateStatusValidation, inquiryController.updateInquiryStatus);

module.exports = router;