const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validation.middleware');

const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('카테고리 이름은 필수입니다.')
    .isLength({ max: 100 }).withMessage('카테고리 이름은 100자 이하여야 합니다.'),
  
  body('slug')
    .trim()
    .notEmpty().withMessage('슬러그는 필수입니다.')
    .isLength({ max: 100 }).withMessage('슬러그는 100자 이하여야 합니다.')
    .matches(/^[a-z0-9-]+$/).withMessage('슬러그는 소문자, 숫자, 하이픈(-)만 포함할 수 있습니다.'),
  
  body('description')
    .optional()
    .trim(),
  
  body('parentId')
    .optional()
    .isInt().withMessage('상위 카테고리 ID는 정수여야 합니다.'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('유효한 이미지 URL을 입력해주세요.'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('활성화 여부는 불리언 값이어야 합니다.'),
  
  body('displayOrder')
    .optional()
    .isInt().withMessage('표시 순서는 정수여야 합니다.'),
  
  validationMiddleware
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('카테고리 이름은 비어있을 수 없습니다.')
    .isLength({ max: 100 }).withMessage('카테고리 이름은 100자 이하여야 합니다.'),
  
  body('slug')
    .optional()
    .trim()
    .notEmpty().withMessage('슬러그는 비어있을 수 없습니다.')
    .isLength({ max: 100 }).withMessage('슬러그는 100자 이하여야 합니다.')
    .matches(/^[a-z0-9-]+$/).withMessage('슬러그는 소문자, 숫자, 하이픈(-)만 포함할 수 있습니다.'),
  
  body('description')
    .optional()
    .trim(),
  
  body('parentId')
    .optional()
    .isInt().withMessage('상위 카테고리 ID는 정수여야 합니다.'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('유효한 이미지 URL을 입력해주세요.'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('활성화 여부는 불리언 값이어야 합니다.'),
  
  body('displayOrder')
    .optional()
    .isInt().withMessage('표시 순서는 정수여야 합니다.'),
  
  validationMiddleware
];

module.exports = {
  categoryValidation: {
    createCategory: createCategoryValidation,
    updateCategory: updateCategoryValidation
  }
};