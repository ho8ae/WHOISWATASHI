const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { userSockets } = require('../utils/socket');

/**
 * 알림 생성 및 실시간 전송
 */
async function createAndSendNotification(userId, data) {
  try {
    // 알림 생성
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        targetId: data.targetId,
        targetType: data.targetType,
        actionUrl: data.actionUrl
      }
    });
    
    // 실시간 전송 (웹소켓 연결된 사용자에게)
    const socketId = userSockets.get(userId);
    if (socketId) {
      const io = global.io; // server.js에서 설정한 전역 io 객체
      io.to(socketId).emit('new_notification', notification);
      
      // 알림 읽지 않은 개수 업데이트
      const unreadCount = await getUnreadCount(userId);
      io.to(socketId).emit('unread_count', { count: unreadCount });
    }
    
    return notification;
  } catch (error) {
    console.error('알림 생성 및 전송 오류:', error);
    return null;
  }
}

/**
 * 주문 상태 변경 알림
 */
async function createOrderStatusNotification(userId, order, status) {
  let title, message, actionUrl;
  
  switch (status) {
    case 'processing':
      title = '주문 처리 중';
      message = `주문(${order.orderNumber})이 처리 중입니다.`;
      break;
    case 'shipped':
      title = '상품 발송';
      message = `주문하신 상품(${order.orderNumber})이 발송되었습니다.`;
      break;
    case 'delivered':
      title = '배송 완료';
      message = `주문하신 상품(${order.orderNumber})이 배송 완료되었습니다.`;
      break;
    case 'cancelled':
      title = '주문 취소';
      message = `주문(${order.orderNumber})이 취소되었습니다.`;
      break;
    default:
      title = '주문 상태 변경';
      message = `주문(${order.orderNumber})의 상태가 변경되었습니다.`;
  }
  
  actionUrl = `/mypage/orders/${order.id}`;
  
  return await createAndSendNotification(userId, {
    type: 'order_status',
    title,
    message,
    targetId: order.id,
    targetType: 'order',
    actionUrl
  });
}

/**
 * 배송 시작 알림
 */
async function createShippingStartedNotification(userId, order, trackingInfo) {
  const title = '배송이 시작되었습니다';
  const message = `주문하신 상품(${order.orderNumber})이 ${trackingInfo.carrier || '택배사'}를 통해 발송되었습니다. 운송장 번호: ${trackingInfo.trackingNumber}`;
  const actionUrl = `/mypage/orders/${order.id}/tracking`;
  
  return await createAndSendNotification(userId, {
    type: 'shipping_update',
    title,
    message,
    targetId: order.id,
    targetType: 'order',
    actionUrl
  });
}

/**
 * 문의글 답변 알림
 */
async function createInquiryAnswerNotification(userId, inquiry) {
  const title = '문의 답변 등록';
  const message = `문의하신 글 '${inquiry.title}'에 답변이 등록되었습니다.`;
  const actionUrl = `/mypage/inquiries/${inquiry.id}`;
  
  return await createAndSendNotification(userId, {
    type: 'inquiry_answer',
    title,
    message,
    targetId: inquiry.id,
    targetType: 'inquiry',
    actionUrl
  });
}

/**
 * 재입고 알림
 */
async function createRestockNotification(userId, product) {
  const title = '관심 상품 재입고';
  const message = `찜하신 상품 '${product.name}'이 재입고 되었습니다.`;
  const actionUrl = `/products/${product.id}`;
  
  return await createAndSendNotification(userId, {
    type: 'product_restock',
    title,
    message,
    targetId: product.id,
    targetType: 'product',
    actionUrl
  });
}

/**
 * 프로모션 알림 (전체 발송)
 */
async function createPromotionNotification(title, message, actionUrl = null) {
  try {
    // 모든 사용자 조회 (대량 사용자라면 페이징 필요)
    const users = await prisma.user.findMany({
      where: { role: 'customer' },
      select: { id: true }
    });
    
    // 각 사용자별로 알림 생성
    const notifications = [];
    for (const user of users) {
      const notification = await createAndSendNotification(user.id, {
        type: 'promotion',
        title,
        message,
        targetType: 'promotion',
        actionUrl
      });
      
      if (notification) {
        notifications.push(notification);
      }
    }
    
    return notifications.length;
  } catch (error) {
    console.error('프로모션 알림 생성 오류:', error);
    return 0;
  }
}

/**
 * 읽지 않은 알림 수 조회
 */
async function getUnreadCount(userId) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
    return count;
  } catch (error) {
    console.error('알림 개수 조회 오류:', error);
    return 0;
  }
}

/**
 * 사용자 알림 목록 조회
 */
async function getUserNotifications(userId, paging = {}) {
  const { page = 1, limit = 20 } = paging;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.notification.count({ where: { userId } })
  ]);
  
  return {
    notifications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  };
}

/**
 * 알림 읽음 처리
 */
async function markAsRead(id, userId) {
  // 권한 확인
  const notification = await prisma.notification.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!notification || notification.userId !== userId) {
    throw new Error('알림을 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  return await prisma.notification.update({
    where: { id: parseInt(id) },
    data: { isRead: true }
  });
}

/**
 * 모든 알림 읽음 처리
 */
async function markAllAsRead(userId) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: { isRead: true }
  });
}

/**
 * 알림 삭제
 */
async function deleteNotification(id, userId) {
  // 권한 확인
  const notification = await prisma.notification.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!notification || notification.userId !== userId) {
    throw new Error('알림을 찾을 수 없거나 접근 권한이 없습니다.');
  }
  
  return await prisma.notification.delete({
    where: { id: parseInt(id) }
  });
}

module.exports = {
  createAndSendNotification,
  createOrderStatusNotification,
  createShippingStartedNotification,
  createInquiryAnswerNotification,
  createRestockNotification,
  createPromotionNotification,
  getUnreadCount,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};