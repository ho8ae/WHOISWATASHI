const notificationService = require('./notification.service');

/**
 * 사용자 알림 목록 조회
 */
async function getUserNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    
    const result = await notificationService.getUserNotifications(userId, { page, limit });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 알림 읽음 처리
 */
async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await notificationService.markAsRead(id, userId);
    
    // 읽지 않은 알림 수
    const unreadCount = await notificationService.getUnreadCount(userId);
    
    res.json({
      success: true,
      message: '알림이 읽음 처리되었습니다.',
      unreadCount
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 알림 읽음 처리
 */
async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    
    await notificationService.markAllAsRead(userId);
    
    res.json({
      success: true,
      message: '모든 알림이 읽음 처리되었습니다.',
      unreadCount: 0
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 알림 삭제
 */
async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await notificationService.deleteNotification(id, userId);
    
    // 읽지 않은 알림 수
    const unreadCount = await notificationService.getUnreadCount(userId);
    
    res.json({
      success: true,
      message: '알림이 삭제되었습니다.',
      unreadCount
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 관리자: 프로모션 알림 전송
 */
async function sendPromotionNotification(req, res, next) {
  try {
    const { title, message, actionUrl } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: '제목과 내용은 필수입니다.'
      });
    }
    
    const sentCount = await notificationService.createPromotionNotification(
      title,
      message,
      actionUrl
    );
    
    res.json({
      success: true,
      message: `${sentCount}명의 사용자에게 프로모션 알림이 발송되었습니다.`,
      sentCount
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 읽지 않은 알림 수 조회
 */
async function getUnreadCount(req, res, next) {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);
    
    res.json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendPromotionNotification,
  getUnreadCount
};