const express = require('express');
const router = express.Router();
const searchController = require('./search.controller');
const { validationMiddleware } = require('../middleware/validation.middleware');
const {
  searchProductsValidation,
  searchSuggestionsValidation,
  popularSearchTermsValidation
} = require('./search.validation');

// 상품 검색 및 필터링
router.get('/products', searchProductsValidation, validationMiddleware, searchController.searchProducts);

// 검색어 자동완성 제안
router.get('/suggestions', searchSuggestionsValidation, validationMiddleware, searchController.getSearchSuggestions);

// 인기 검색어 목록
router.get('/popular', popularSearchTermsValidation, validationMiddleware, searchController.getPopularSearchTerms);

module.exports = router;