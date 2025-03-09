const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { categoryValidation } = require('./category.validation');

// 모든 카테고리 조회
router.get('/', categoryController.getAllCategories);

// 카테고리 트리 조회
router.get('/tree', categoryController.getCategoryTree);

// ID로 카테고리 조회
router.get('/:id', categoryController.getCategoryById);

// Slug로 카테고리 조회
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// 하위 카테고리 조회
router.get('/:id/subcategories', categoryController.getSubcategories);

// 관리자 권한 필요한 엔드포인트
// 카테고리 생성
router.post('/', authMiddleware.isAdmin, categoryValidation.createCategory, categoryController.createCategory);

// 카테고리 수정
router.put('/:id', authMiddleware.isAdmin, categoryValidation.updateCategory, categoryController.updateCategory);

// 카테고리 삭제
router.delete('/:id', authMiddleware.isAdmin, categoryController.deleteCategory);

module.exports = router;