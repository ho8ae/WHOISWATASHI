const { body, param, query } = require('express-validator');

// 상품 리뷰 목록 조회 유효성 검사
const getProductReviewsValidation = [
  param('productId')
    .isInt({ min: 1 })
    .withMessage('유효한 상품 ID가 필요합니다.'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상의 정수여야 합니다.'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('페이지당 항목 수는 1에서 100 사이의 정수여야 합니다.'),
  
  query('sort')
    .optional()
    .isIn(['latest', 'oldest', 'highest', 'lowest'])
    .withMessage('정렬 기준은 latest, oldest, highest, lowest 중 하나여야 합니다.')
];

// 리뷰 ID 파라미터 유효성 검사
const reviewIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('유효한 리뷰 ID가 필요합니다.')
];

// 리뷰 작성 유효성 검사
const createReviewValidation = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('유효한 상품 ID가 필요합니다.'),
  
  body('orderId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('유효한 주문 ID가 필요합니다.'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('평점은 1에서 5 사이의 정수여야 합니다.'),
  
  body('title')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('제목은 1-100자 사이여야 합니다.'),
  
  body('content')
    .isString()
    .isLength({ min: 10 })
    .withMessage('내용은 최소 10자 이상이어야 합니다.'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('이미지는 배열 형태여야 합니다.')
    .custom((images) => {
      if (images.length > 5) {
        throw new Error('이미지는 최대 5개까지 업로드할 수 있습니다.');
      }
      
      for (const url of images) {
        if (typeof url !== 'string') {
          throw new Error('이미지 URL은 문자열이어야 합니다.');
        }
      }
      
      return true;
    })
];

// 리뷰 수정 유효성 검사
const updateReviewValidation = [
  ...reviewIdParamValidation,
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('평점은 1에서 5 사이의 정수여야 합니다.'),
  
  body('title')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('제목은 1-100자 사이여야 합니다.'),
  
  body('content')
    .optional()
    .isString()
    .isLength({ min: 10 })
    .withMessage('내용은 최소 10자 이상이어야 합니다.'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('이미지는 배열 형태여야 합니다.')
    .custom((images) => {
      if (images.length > 5) {
        throw new Error('이미지는 최대 5개까지 업로드할 수 있습니다.');
      }
      
      for (const url of images) {
        if (typeof url !== 'string') {
          throw new Error('이미지 URL은 문자열이어야 합니다.');
        }
      }
      
      return true;
    })
];

module.exports = {
  getProductReviewsValidation,
  reviewIdParamValidation,
  createReviewValidation,
  updateReviewValidation
};