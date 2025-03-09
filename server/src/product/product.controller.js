const productService = require('./product.service');

/**
 * 모든 상품 조회
 */
async function getAllProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts(req.query);
    res.json({
      success: true,
      ...products
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ID로 상품 조회
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Slug로 상품 조회
 */
async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 상품 생성
 */
async function createProduct(req, res, next) {
  try {
    const newProduct = await productService.createProduct(req.body);
    
    res.status(201).json({
      success: true,
      data: newProduct,
      message: '상품이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 상품 수정
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    
    res.json({
      success: true,
      data: updatedProduct,
      message: '상품이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 상품 삭제
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    
    res.json({
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 카테고리별 상품 조회
 */
async function getProductsByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const products = await productService.getProductsByCategory(categoryId, req.query);
    
    res.json({
      success: true,
      ...products
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};