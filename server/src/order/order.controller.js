const orderService = require('./order.service');
const cartService = require('../cart/cart.service');
const paymentService = require('../payment/payment.service');


/**
 * 주문 생성
 */
async function createOrder(req, res, next) {
  try {
    // 사용자 ID 또는 세션 ID 확인
    const userId = req.user?.id;
    const sessionId = req.cookies.cartSessionId;
    
    if (!userId  && !req.body.guestPassword) {
      return res.status(400).json({
        success: false,
        message: '비회원 주문 시 주문 비밀번호가 필요합니다.'
      });
    }
    
    // 장바구니 조회
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    
    // 주문 정보 구성
    const orderData = {
      ...req.body,
      userId,
      cartId: cart.id
    };
    
    // 주문 생성
    const order = await orderService.createOrder(orderData);
    
    // 장바구니 세션 쿠키 제거 (주문 완료 후)
    if (!userId) {
      res.clearCookie('cartSessionId');
    }
    
    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        shippingFee: order.shippingFee
      },
      message: '주문이 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 상세 조회
 */
async function getOrderDetails(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }
    
    // 본인 주문인지 확인 (관리자는 모든 주문 조회 가능)
    if (userId !== order.userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '접근 권한이 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 사용자 주문 목록 조회
 */
async function getUserOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await orderService.getUserOrders(userId, req.query);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 비회원 주문 조회
 */
async function getGuestOrder(req, res, next) {
  try {
    const { orderNumber, password } = req.body;
    
    if (!orderNumber || !password) {
      return res.status(400).json({
        success: false,
        message: '주문번호와 비밀번호를 입력해주세요.'
      });
    }
    
    const order = await orderService.getGuestOrder(orderNumber, password);
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PortOne 결제 검증
 */
async function verifyPortOnePayment(req, res, next) {
  try {
    const { impUid, orderId, amount } = req.body;
    
    const payment = await paymentService.verifyPortOnePayment({
      impUid,
      orderId,
      amount
    });
    
    res.json({
      success: true,
      data: payment,
      message: '결제가 완료되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 취소
 */
async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }
    
    // 본인 주문인지 확인 (관리자는 모든 주문 취소 가능)
    if (userId !== order.userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '접근 권한이 없습니다.'
      });
    }
    
    await orderService.cancelOrder(id);
    
    res.json({
      success: true,
      message: '주문이 취소되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrderDetails,
  getUserOrders,
  getGuestOrder,
  verifyPortOnePayment,
  cancelOrder
};