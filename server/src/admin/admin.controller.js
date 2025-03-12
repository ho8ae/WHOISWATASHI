const adminService = require('./admin.service');

/**
 * 대시보드 통계 조회
 */
async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 사용자 조회
 */
async function getAllUsers(req, res, next) {
  try {
    const result = await adminService.getAllUsers(req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 사용자 상세 정보 조회
 */
async function getUserDetails(req, res, next) {
  try {
    const { id } = req.params;
    const user = await adminService.getUserDetails(id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 사용자 역할 변경
 */
async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({
        success: false,
        message: '역할(role)이 필요합니다.'
      });
    }
    
    const updatedUser = await adminService.updateUserRole(id, role);
    
    res.json({
      success: true,
      data: updatedUser,
      message: '사용자 역할이 변경되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 주문 조회
 */
async function getAllOrders(req, res, next) {
  try {
    const result = await adminService.getAllOrders(req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 상태 및 배송 정보 업데이트
 */
async function updateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedOrder = await adminService.updateOrderAdmin(id, updateData);
    
    res.json({
      success: true,
      data: updatedOrder,
      message: '주문이 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 품절 상품 목록 조회
 */
async function getOutOfStockProducts(req, res, next) {
  try {
    const products = await adminService.getOutOfStockProducts();
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 제품 재고 업데이트
 */
async function updateProductStock(req, res, next) {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        message: '재고 수량이 필요합니다.'
      });
    }
    
    const updatedVariant = await adminService.updateProductStock(id, stock);
    
    res.json({
      success: true,
      data: updatedVariant,
      message: '재고가 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  getAllOrders,
  updateOrder,
  getOutOfStockProducts,
  updateProductStock
};