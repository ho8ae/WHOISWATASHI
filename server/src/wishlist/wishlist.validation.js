const { body, param } = require('express-validator');

// 상품 ID 파라미터 유효성 검사
const productIdParamValidation = [
  param('productId')
    .isInt({ min: 1 })
    .withMessage('유효한 상품 ID가 필요합니다.')
];

// 위시리스트 항목 ID 파라미터 유효성 검사
const wishlistIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('유효한 위시리스트 항목 ID가 필요합니다.')
];

// 상품 추가 유효성 검사
const addToWishlistValidation = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('유효한 상품 ID가 필요합니다.')
];

module.exports = {
  productIdParamValidation,
  wishlistIdParamValidation,
  addToWishlistValidation
};