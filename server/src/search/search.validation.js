const { query } = require('express-validator');

// 상품 검색 유효성 검사
const searchProductsValidation = [
  query('keyword')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('검색어는 1-100자 사이여야 합니다.'),
  
  query('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('유효한 카테고리 ID가 필요합니다.'),
  
  query('minPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('최소 가격은 0 이상이어야 합니다.'),
  
  query('maxPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('최대 가격은 0 이상이어야 합니다.')
    .custom((value, { req }) => {
      const minPrice = parseInt(req.query.minPrice || 0);
      const maxPrice = parseInt(value);
      if (minPrice > maxPrice) {
        throw new Error('최대 가격은 최소 가격보다 커야 합니다.');
      }
      return true;
    }),
  
  query('sortBy')
    .optional()
    .isIn(['relevance', 'price', 'name', 'newest', 'popularity'])
    .withMessage('정렬 기준은 relevance, price, name, newest, popularity 중 하나여야 합니다.'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('정렬 순서는 asc 또는 desc여야 합니다.'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상이어야 합니다.'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('페이지당 항목 수는 1-100 사이여야 합니다.')
];

// 검색어 자동완성 유효성 검사
const searchSuggestionsValidation = [
  query('keyword')
    .notEmpty()
    .withMessage('검색어가 필요합니다.')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('검색어는 1-100자 사이여야 합니다.'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('제안 수는 1-20 사이여야 합니다.')
];

// 인기 검색어 유효성 검사
const popularSearchTermsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('제한 수는 1-50 사이여야 합니다.')
];

module.exports = {
  searchProductsValidation,
  searchSuggestionsValidation,
  popularSearchTermsValidation
};