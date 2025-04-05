const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { productValidation } = require('./product.validation');

// 모든 상품 조회 (필터링, 검색, 페이지네이션 지원)
router.get('/', productController.getAllProducts);

// ID로 상품 조회
router.get('/:id', productController.getProductById);

// Slug로 상품 조회
router.get('/slug/:slug', productController.getProductBySlug);

// 카테고리별 상품 조회
router.get('/category/:categoryId', productController.getProductsByCategory);


// 관리자 권한 필요한 엔드포인트
// 상품 생성
router.post('/', authMiddleware.isAdmin, productValidation.createProduct, productController.createProduct);

// 상품 수정
router.put('/:id', authMiddleware.isAdmin, productValidation.updateProduct, productController.updateProduct);

// 상품 삭제
router.delete('/:id', authMiddleware.isAdmin, productController.deleteProduct);

// 상품 변형 관련 라우트    
router.get('/:productId/variants', productController.getProductVariants);
router.post('/:productId/variants', authMiddleware.isAdmin, productController.createProductVariant);
router.get('/variants/all', productController.getAllProductVariants);
router.get('/variants/:variantId', productController.getProductVariantById);
router.put('/variants/:variantId', authMiddleware.isAdmin, productController.updateProductVariant);
router.delete('/variants/:variantId', authMiddleware.isAdmin, productController.deleteProductVariant);

module.exports = router;