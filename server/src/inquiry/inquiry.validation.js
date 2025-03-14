// inquiry.validation.js
const { body, param, query } = require('express-validator');
const { validationMiddleware } = require('../middleware/validation.middleware');

// 문의글 작성 유효성 검증
const createInquiryValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('제목은 필수 입력사항입니다.')
    .isLength({ min: 2, max: 255 }).withMessage('제목은 2~255자 사이여야 합니다.'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('내용은 필수 입력사항입니다.')
    .isLength({ min: 10 }).withMessage('내용은 최소 10자 이상이어야 합니다.'),
  
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('비공개 여부는 불리언 값이어야 합니다.'),
  
  // 비회원 작성 관련 필드
  body('email')
    .optional()
    .isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
  
  body('name')
    .optional()
    .isLength({ min: 2 }).withMessage('이름은.최소 2자 이상이어야 합니다.'),
  
  body('password')
    .optional()
    .isLength({ min: 4 }).withMessage('비밀번호는 최소 4자 이상이어야 합니다.'),
  
  validationMiddleware
];

// 문의글 수정 유효성 검증
const updateInquiryValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('제목은 비어있을 수 없습니다.')
    .isLength({ min: 2, max: 255 }).withMessage('제목은 2~255자 사이여야 합니다.'),
  
  body('content')
    .optional()
    .trim()
    .notEmpty().withMessage('내용은 비어있을 수 없습니다.')
    .isLength({ min: 10 }).withMessage('내용은 최소 10자 이상이어야 합니다.'),
  
  body('isPrivate')
    .optional()
    .isBoolean().withMessage('비공개 여부는 불리언 값이어야 합니다.'),
  
  body('password')
    .optional()
    .isLength({ min: 4 }).withMessage('비밀번호는 최소 4자 이상이어야 합니다.'),
  
  validationMiddleware
];

// 문의글 답변 유효성 검증
const createAnswerValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('답변 내용은 필수 입력사항입니다.')
    .isLength({ min: 10 }).withMessage('답변 내용은 최소 10자 이상이어야 합니다.'),
  
  validationMiddleware
];

// 문의글 상태 변경 유효성 검증
const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('상태값은 필수 입력사항입니다.')
    .isIn(['pending', 'answered', 'closed']).withMessage('유효하지 않은 상태값입니다.'),
  
  validationMiddleware
];

// 비공개 글 접근 유효성 검증
const accessPrivateValidation = [
  body('password')
    .notEmpty().withMessage('비밀번호는 필수 입력사항입니다.')
    .isLength({ min: 4 }).withMessage('비밀번호는 최소 4자 이상이어야 합니다.'),
  
  validationMiddleware
];

// 목록 조회 필터 유효성 검증
const listQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('한 페이지 항목 수는 1~100 사이의 정수여야 합니다.')
    .toInt(),
  
  query('status')
    .optional()
    .isIn(['pending', 'answered', 'closed']).withMessage('유효하지 않은 상태값입니다.'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'title']).withMessage('유효하지 않은 정렬 기준입니다.'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc']).withMessage('정렬 방향은 asc 또는 desc여야 합니다.'),
  
  validationMiddleware
];

module.exports = {
  createInquiryValidation,
  updateInquiryValidation,
  createAnswerValidation,
  updateStatusValidation,
  accessPrivateValidation,
  listQueryValidation
};