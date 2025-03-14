const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const notificationService = require('../notification/notification.service');

/**
 * 주문 배송 상태 조회
 */
async function getOrderTracking(orderId, userId) {
  // 주문 기본 정보 조회
  const order = await prisma.order.findUnique({
    where: { 
      id: Number(orderId),
      ...(userId && { userId: Number(userId) }) // 사용자 ID가 있으면 본인 주문만 조회 가능
    },
    include: {
      histories: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  // 배송 추적 정보를 제공하는 객체 생성
  const trackingInfo = {
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,
    currentStatus: order.status,
    paymentStatus: order.paymentStatus,
    shippingDetails: {
      carrier: getCarrierName(order.trackingNumber), // 배송사 이름 가져오기 (구현 필요)
      trackingNumber: order.trackingNumber,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      estimatedDelivery: getEstimatedDelivery(order), // 예상 배송일 계산 (구현 필요)
    },
    statusHistory: formatOrderHistory(order.histories),
    externalTrackingUrl: getExternalTrackingUrl(order.trackingNumber), // 외부 배송 추적 URL (구현 필요)
  };
  
  // 배송 운송장이 있는 경우 외부 배송 추적 API 호출 (선택 사항)
  if (order.trackingNumber && order.status === 'shipped') {
    try {
      const externalTrackingInfo = await getExternalTrackingInfo(order.trackingNumber);
      trackingInfo.externalTrackingDetails = externalTrackingInfo;
    } catch (error) {
      console.error('외부 배송 추적 서비스 호출 오류:', error);
      // 외부 API 호출 실패해도 기본 정보는 제공
    }
  }
  
  return trackingInfo;
}

/**
 * 주문 상태 변경 내역 조회
 */
async function getOrderStatusHistory(orderId, userId) {
  // 주문 소유자 확인
  if (userId) {
    const order = await prisma.order.findUnique({
      where: { 
        id: Number(orderId)
      },
      select: { userId: true }
    });
    
    if (!order || order.userId !== Number(userId)) {
      throw new Error('접근 권한이 없습니다.');
    }
  }
  
  // 상태 변경 내역 조회
  const history = await prisma.orderHistory.findMany({
    where: { orderId: Number(orderId) },
    orderBy: { createdAt: 'desc' }
  });
  
  return formatOrderHistory(history);
}

/**
 * 주문 상태 변경 및 히스토리 저장 (관리자 전용)
 */
async function updateOrderStatus(orderId, status, message) {
  // 주문 존재 확인
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  // 중복 상태 변경 방지
  if (order.status === status) {
    return { order, isChanged: false };
  }
  
  // 트랜잭션으로 상태 변경 및 히스토리 기록
  const result = await prisma.$transaction(async (tx) => {
    // 1. 주문 상태 변경
    const updatedOrder = await tx.order.update({
      where: { id: Number(orderId) },
      data: { 
        status,
        // 배송 관련 상태인 경우 추가 필드 업데이트
        ...(status === 'shipped' && { shippedAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date() })
      }
    });
    
    // 2. 상태 변경 히스토리 기록
    const history = await tx.orderHistory.create({
      data: {
        orderId: Number(orderId),
        status,
        message: message || getDefaultStatusMessage(status)
      }
    });
    
    return { updatedOrder, history };
  });
  
  return { 
    order: result.updatedOrder,
    history: result.history,
    isChanged: true
  };
}

/**
 * 배송 추적 정보 업데이트 (관리자 전용)
 */
async function updateTrackingInfo(orderId, trackingData) {
  const { trackingNumber, carrier, shippedAt } = trackingData;
  
  // 주문 존재 확인
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  // 운송장 정보 업데이트 및 상태 변경
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // 1. 주문 정보 업데이트
    const updated = await tx.order.update({
      where: { id: Number(orderId) },
      data: {
        trackingNumber,
        status: 'shipped',
        shippedAt: shippedAt || new Date()
      }
    });
    
    // 2. 상태 변경 히스토리 기록
    await tx.orderHistory.create({
      data: {
        orderId: Number(orderId),
        status: 'shipped',
        message: `배송 시작. 운송장: ${trackingNumber}${carrier ? ` (${carrier})` : ''}`
      }
    });
    
    return updated;
  });

   // 배송 시작 알림 발송
   if (updatedOrder.userId) {
    await notificationService.createShippingStartedNotification(
      updatedOrder.userId,
      updatedOrder,
      {
        carrier: trackingData.carrier,
        trackingNumber: trackingData.trackingNumber
      }
    );
  }
  
  return updatedOrder;
}

/**
 * 히스토리 데이터 포맷팅
 */
function formatOrderHistory(history) {
  return history.map(item => ({
    status: item.status,
    message: item.message || getDefaultStatusMessage(item.status),
    timestamp: item.createdAt,
    displayStatus: getDisplayStatus(item.status)
  }));
}

/**
 * 상태 코드에 따른 기본 메시지 생성
 */
function getDefaultStatusMessage(status) {
  const messages = {
    'pending': '주문이 접수되었습니다.',
    'processing': '주문 처리 중입니다.',
    'shipped': '상품이 발송되었습니다.',
    'delivered': '배송이 완료되었습니다.',
    'cancelled': '주문이 취소되었습니다.',
    'refunded': '환불이 완료되었습니다.'
  };
  
  return messages[status] || '주문 상태가 업데이트되었습니다.';
}

/**
 * 상태 코드에 따른 표시 텍스트
 */
function getDisplayStatus(status) {
  const displayTexts = {
    'pending': '주문 접수',
    'processing': '상품 준비 중',
    'shipped': '배송 중',
    'delivered': '배송 완료',
    'cancelled': '주문 취소',
    'refunded': '환불 완료'
  };
  
  return displayTexts[status] || status;
}

/**
 * 배송사 이름 가져오기
 */
function getCarrierName(trackingNumber) {
  // 구현 필요: 운송장 번호 형식이나 설정에 따라 배송사 결정
  // 임시 구현: 모든 운송장은 기본 배송사로 설정
  return '대한통운';
}

/**
 * 예상 배송일 계산
 */
function getEstimatedDelivery(order) {
  if (!order.shippedAt) {
    return null;
  }
  
  // 배송시작일 + 3일로 예상 배송일 계산
  const estimatedDate = new Date(order.shippedAt);
  estimatedDate.setDate(estimatedDate.getDate() + 3);
  
  return estimatedDate;
}

/**
 * 외부 배송 추적 URL 생성
 */
function getExternalTrackingUrl(trackingNumber) {
  if (!trackingNumber) {
    return null;
  }
  
  // 구현 필요: 배송사별 추적 URL 생성
  // 예시: 대한통운 배송 추적 URL
  return `https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=${trackingNumber}`;
}

/**
 * 외부 배송 추적 API 호출 (선택 사항)
 */
async function getExternalTrackingInfo(trackingNumber) {
  // 실제 구현 시 외부 배송 조회 API 연동 필요
  // 예시: 스마트택배 API, 스윗트래커 API 등
  
  // 임시 구현: 더미 데이터 반환
  return {
    carrier: '대한통운',
    trackingNumber: trackingNumber,
    status: '배송 중',
    trackingDetails: [
      {
        status: '상품 인수',
        location: '집화점',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        status: '상품 이동 중',
        location: '물류센터',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        status: '배송 출발',
        location: '배송점',
        timestamp: new Date()
      }
    ]
  };
}

module.exports = {
  getOrderTracking,
  getOrderStatusHistory,
  updateOrderStatus,
  updateTrackingInfo
};