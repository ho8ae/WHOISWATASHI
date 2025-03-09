const categoryService = require('./category.service');

/**
 * 모든 카테고리 조회
 */
async function getAllCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 카테고리 트리 조회
 */
async function getCategoryTree(req, res, next) {
  try {
    const categoryTree = await categoryService.getCategoryTree();
    res.json({
      success: true,
      data: categoryTree
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ID로 카테고리 조회
 */
async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '카테고리를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Slug로 카테고리 조회
 */
async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '카테고리를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 하위 카테고리 조회
 */
async function getSubcategories(req, res, next) {
  try {
    const { id } = req.params;
    const subcategories = await categoryService.getSubcategories(id);
    
    res.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 카테고리 생성
 */
async function createCategory(req, res, next) {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    
    res.status(201).json({
      success: true,
      data: newCategory,
      message: '카테고리가 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 카테고리 수정
 */
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(id, req.body);
    
    res.json({
      success: true,
      data: updatedCategory,
      message: '카테고리가 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 카테고리 삭제
 */
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    
    res.json({
      success: true,
      message: '카테고리가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories,
  getCategoryTree,
  getCategoryById,
  getCategoryBySlug,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory
};