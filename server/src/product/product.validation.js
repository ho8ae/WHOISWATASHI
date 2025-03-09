const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validation.middleware');

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('상품명은 필수입니다.')
    .isLength({ max: 255 }).withMessage('상품명은 255자 이하여야 합니다.'),
  
  body('slug')
    .trim()
    .notEmpty().withMessage('슬러그는 필수입니다.')
    .isLength({ max: 255 }).withMessage('슬러그는 255자 이하여야 합니다.')
    .matches(/^[a-z0-9-]+$/).withMessage('슬러그는 소문자, 숫자, 하이픈(-)만 포함할 수 있습니다.'),
  
  body('description')
    .optional()
    .trim(),
  
  body('price')
    .notEmpty().withMessage('가격은 필수입니다.')
    .isFloat({ min: 0 }).withMessage('가격은 0 이상의 숫자여야 합니다.'),
  
  body('salePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('할인 가격은 0 이상의 숫자여야 합니다.'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('재고는 0 이상의 정수여야 합니다.'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('SKU는 100자 이하여야 합니다.'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('활성화 여부는 불리언 값이어야 합니다.'),
  
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('특집 상품 여부는 불리언 값이어야 합니다.'),
  
  body('categories')
    .optional()
    .isArray().withMessage('카테고리는 배열이어야 합니다.'),
  
  body('images')
    .optional()
    .isArray().withMessage('이미지는 배열이어야 합니다.'),
  
  body('images.*.imageUrl')
    .optional()
    .isURL().withMessage('유효한 이미지 URL을 입력해주세요.'),
  
  validationMiddleware
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('상품명은 비어있을 수 없습니다.')
    .isLength({ max: 255 }).withMessage('상품명은 255자 이하여야 합니다.'),
  
  body('slug')
    .optional()
    .trim()
    .notEmpty().withMessage('슬러그는 비어있을 수 없습니다.')
    .isLength({ max: 255 }).withMessage('슬러그는 255자 이하여야 합니다.')
    .matches(/^[a-z0-9-]+$/).withMessage('슬러그는 소문자, 숫자, 하이픈(-)만 포함할 수 있습니다.'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('가격은 0 이상의 숫자여야 합니다.'),
  
  validationMiddleware
];

module.exports = {
  productValidation: {
    createProduct: createProductValidation,
    updateProduct: updateProductValidation
  }
};