const trackingService = require('./tracking.service');

/**
 * 주문 배송 상태 조회
 */
async function getOrderTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id; // 인증된 사용자만 본인 주문 조회 가능
    
    const trackingInfo = await trackingService.getOrderTracking(orderId, userId);
    
    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 상태 변경 내역 조회
 */
async function getOrderStatusHistory(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id; // 인증된 사용자만 본인 주문 내역 조회 가능
    
    const history = await trackingService.getOrderStatusHistory(orderId, userId);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 상태 변경 (관리자 전용)
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;
    
    const result = await trackingService.updateOrderStatus(orderId, status, message);
    
    res.json({
      success: true,
      data: {
        order: result.order,
        history: result.history
      },
      message: result.isChanged 
        ? '주문 상태가 업데이트되었습니다.' 
        : '주문 상태가 이미 최신 상태입니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 배송 추적 정보 업데이트 (관리자 전용)
 */
async function updateTrackingInfo(req, res, next) {
  try {
    const { orderId } = req.params;
    const trackingData = req.body;
    
    const updatedOrder = await trackingService.updateTrackingInfo(orderId, trackingData);
    
    res.json({
      success: true,
      data: updatedOrder,
      message: '배송 추적 정보가 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrderTracking,
  getOrderStatusHistory,
  updateOrderStatus,
  updateTrackingInfo
};